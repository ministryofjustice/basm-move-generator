const prompts = require('prompts');
const config = require('./lib/utils/config');
const { BasmApi } = require('./lib/clients/basmApi');
const { BasmService } = require('./lib/service/basmService');
const { JsonApiClient } = require('./lib/clients/jsonApiClient');
const { logger } = require('./lib/utils/logger');
const Generator = require('./lib/generators');
const printReferenceData = require('./lib/referenceData');
const { questions, ModeEnum, ScenariosEnum } = require('./lib/utils/questions');

const run = async () => {
  const basmApi = new BasmApi(new JsonApiClient(logger.noop, config.apiEndpoint));
  const basmService = new BasmService(logger.console, basmApi);
  await basmService.initToken();
  const generator = new Generator(logger.console, basmService);

  const { mode, scenarios } = await prompts(questions);

  if (mode === ModeEnum.GENERATE) {
    if (scenarios.includes(ScenariosEnum.NO_IDENTIFIERS)) await generator.fromCourt();
    if (scenarios.includes(ScenariosEnum.PNC_ONLY)) await generator.fromCourtWithPnc();
    if (scenarios.includes(ScenariosEnum.FROM_CUSTODY_SUITE)) await generator.fromPoliceCustodySuite();
  } else if (mode === ModeEnum.PRINT_REFERENCE_DATA) {
    await printReferenceData(logger.console, basmApi);
  } else {
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
