const prompts = require('prompts');
const { questions, ModeEnum, ScenariosEnum } = require('../utils/questions');
const printReferenceData = require('../referenceData');
const { logger } = require('../utils/logger');

module.exports = async (generator, basmApi) => {
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
