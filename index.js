const config = require('./lib/utils/config');
const { BasmApi } = require('./lib/clients/basmApi');
const { BasmService } = require('./lib/service/basmService');
const { JsonApiClient } = require('./lib/clients/jsonApiClient');
const { logger } = require('./lib/utils/logger');
const Generator = require('./lib/generators');
const printReferenceData = require('./lib/referenceData');

const run = async (mode = 'GENERATE') => {
  const basmApi = new BasmApi(new JsonApiClient(logger.noop, config.apiEndpoint));
  const basmService = new BasmService(logger.console, basmApi);
  await basmService.initToken();
  const generator = new Generator(logger.console, basmService);

  switch (mode) {
    case 'GENERATE': {
      await generator.fromCourt();

      await generator.fromCourtWithPnc();

      await generator.fromPoliceCustodySuite();
      return;
    }
    case 'PRINT_REFERENCE_DATA': {
      printReferenceData(logger.console, basmApi);
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
