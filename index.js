const config = require('./lib/utils/config');
const { BasmApi } = require('./lib/clients/basmApi');
const { BasmService } = require('./lib/service/basmService');
const { JsonApiClient } = require('./lib/clients/jsonApiClient');
const { logger } = require('./lib/utils/logger');
const Generator = require('./lib/generators');
const wpipPrompt = require('./lib/prompts/wpipPrompt');
const { AuthClient } = require('./lib/clients/authClient');
const { PrisonerSearchService } = require('./lib/service/prisonerSearchService');
const { PrisonerSearchClient } = require('./lib/clients/prisonerSearchClient');

const run = async () => {
  const authClient = new AuthClient(logger.console, config.auth.apiEndpoint);
  const prisonerSearchClient = new PrisonerSearchClient(logger.console, config.prisonerSearch.apiEndpoint, authClient);
  const prisonerSearchService = new PrisonerSearchService(logger.console, prisonerSearchClient);

  const basmApi = new BasmApi(new JsonApiClient(logger.noop, config.basm.apiEndpoint));
  const basmService = new BasmService(logger.console, basmApi, config.basm.toPrison);
  await basmService.initToken();

  const generator = new Generator(logger.console, basmService, prisonerSearchService);

  await wpipPrompt(generator, basmApi);
};

run().catch(e => {
  console.error('!!!  ERROR  !!!');
  console.error(e.message);
  console.error(e?.config?.url);
  console.error(e?.config?.data);
  console.error(JSON.stringify(e?.response?.data, null, 2));
  console.error(e);
});
