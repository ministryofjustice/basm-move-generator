const prompts = require('prompts');
const config = require('./lib/utils/config');
const { BasmApi } = require('./lib/clients/basmApi');
const { BasmService } = require('./lib/service/basmService');
const { JsonApiClient } = require('./lib/clients/jsonApiClient');
const { logger } = require('./lib/utils/logger');
const Generator = require('./lib/generators');
const printReferenceData = require('./lib/referenceData');

const ModeEnum = { GENERATE: 'GENERATE', PRINT_REFERENCE_DATA: 'PRINT_REFERENCE_DATA' };
const ScenariosEnum = { NO_IDENTIFIERS: 'NO_IDENTIFIERS', PNC_ONLY: 'PNC_ONLY', FROM_CUSTODY_SUITE: 'FROM_CUSTODY_SUITE' };

const multiselectPrompt = async (message = 'message', choices = [], max = 99, hint = '- Space to select. Return to submit') => prompts({
  type: 'multiselect',
  name: 'value',
  message,
  choices,
  max,
  hint,
}).then((result) => result.value);

const run = async () => {
  const basmApi = new BasmApi(new JsonApiClient(logger.noop, config.apiEndpoint));
  const basmService = new BasmService(logger.console, basmApi);
  await basmService.initToken();
  const generator = new Generator(logger.console, basmService);

  const mode = await multiselectPrompt('Running mode', [
    { title: 'Generate Test Data', value: ModeEnum.GENERATE },
    { title: 'Print BaSM Reference Data', value: ModeEnum.PRINT_REFERENCE_DATA },
  ], 1).then((result) => result[0]);

  switch (mode) {
    case ModeEnum.GENERATE: {
      const scenarios = await multiselectPrompt('Choose Scenarios', [
        { title: 'No Identifiers', value: ScenariosEnum.NO_IDENTIFIERS },
        { title: 'PNC Only', value: ScenariosEnum.PNC_ONLY },
        { title: 'From Custody Suite', value: ScenariosEnum.FROM_CUSTODY_SUITE },
      ]);

      if (scenarios.includes(ScenariosEnum.NO_IDENTIFIERS)) await generator.fromCourt();
      if (scenarios.includes(ScenariosEnum.PNC_ONLY)) await generator.fromCourtWithPnc();
      // eslint-disable-next-line max-len
      if (scenarios.includes(ScenariosEnum.FROM_CUSTODY_SUITE)) await generator.fromPoliceCustodySuite();

      return;
    }
    case ModeEnum.PRINT_REFERENCE_DATA: {
      await printReferenceData(logger.console, basmApi);
      break;
    }
    default:
      throw Error('Data not generated or printed');
  }
};

run().catch((e) => {
  console.error('!!!  ERROR  !!!');
  console.error(e.message);
  console.error(e?.config?.url);
  console.error(e?.config?.data);
  console.error(JSON.stringify(e?.response?.data, null, 2));
  console.error(e);
});
