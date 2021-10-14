const config = require("./lib/utils/config");
const { BasmApi } = require("./lib/clients/basmApi");
const { JsonApiClient } = require("./lib/clients/jsonApiClient");
const { logger } = require("./lib/utils/logger");
const generators = require("./lib/generators");
const printReferenceData = require("./lib/referenceData");

const run = async (mode = "GENERATE") => {
  const api = new BasmApi(new JsonApiClient(logger.noop, config.apiEndpoint));
  await api.initToken();

  switch (mode) {
    case "GENERATE": {
      await generators.fromPrison(logger.console, api);
      await generators.fromCourt(logger.console, api);
      await generators.fromCourtWithPnc(logger.console, api);
      await generators.fromPoliceCustodySuite(logger.console, api);
      return;
    }
    case "PRINT_REFERENCE_DATA": {
      printReferenceData(logger.console, api);
      return;   
    }
  }
};

run().catch((e) => {
  console.error("!!!  ERROR  !!!");
  console.error(e.message);
  console.error(e?.config?.url);
  console.error(e?.config?.data);
  console.error(JSON.stringify(e?.response?.data, null, 2));
});
