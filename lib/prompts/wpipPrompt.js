const prompts = require('prompts');
const printReferenceData = require('../referenceData');
const { logger } = require('../utils/logger');

const ModeEnum = { GENERATE: 'GENERATE', PRINT_REFERENCE_DATA: 'PRINT_REFERENCE_DATA' };
const ScenariosEnum = {
  NO_IDENTIFIERS: 'NO_IDENTIFIERS',
  PNC_ONLY_UNMATCHED: 'PNC_ONLY_UNMATCHED',
  COURT_RETURN: 'COURT_RETURN',
  FROM_CUSTODY_SUITE: 'FROM_CUSTODY_SUITE',
  SINGLE_MATCH: 'SINGLE_MATCH',
  MULTIPLE_MATCH: 'MULTIPLE_MATCH',
};

const multiselectIfGenerateElseSkip = previousAnswer => (previousAnswer === ModeEnum.GENERATE ? 'multiselect' : false);

const questions = [
  {
    type: 'select',
    name: 'mode',
    message: 'Running mode',
    choices: [
      { title: 'Generate Test Data', value: ModeEnum.GENERATE },
      { title: 'Print BaSM Reference Data', value: ModeEnum.PRINT_REFERENCE_DATA },
    ],
  },
  {
    type: multiselectIfGenerateElseSkip,
    name: 'scenarios',
    message: 'Choose Scenarios',
    choices: [
      { title: 'No Identifiers', value: ScenariosEnum.NO_IDENTIFIERS },
      { title: 'PNC Only - Unmatched', value: ScenariosEnum.PNC_ONLY_UNMATCHED },
      { title: 'Court Return', value: ScenariosEnum.COURT_RETURN },
      { title: 'From Custody Suite', value: ScenariosEnum.FROM_CUSTODY_SUITE },
      { title: 'Single Match (DO NOT BOOK IN UNLESS NEEDED)', value: ScenariosEnum.SINGLE_MATCH },
      { title: 'Multiple Match (DO NOT BOOK IN UNLESS NEEDED)', value: ScenariosEnum.MULTIPLE_MATCH },
    ],
    min: 1,
  },
];

module.exports = async (generator, basmApi) => {
  const { mode, scenarios } = await prompts(questions);

  if (mode === ModeEnum.GENERATE) {
    if (scenarios.includes(ScenariosEnum.NO_IDENTIFIERS)) await generator.fromCourt();
    if (scenarios.includes(ScenariosEnum.PNC_ONLY_UNMATCHED)) await generator.fromCourtWithUnmatchedPnc();
    if (scenarios.includes(ScenariosEnum.COURT_RETURN)) await generator.courtReturn();
    if (scenarios.includes(ScenariosEnum.FROM_CUSTODY_SUITE)) await generator.fromPoliceCustodySuite();
    if (scenarios.includes(ScenariosEnum.SINGLE_MATCH)) await generator.singleMatch();
    if (scenarios.includes(ScenariosEnum.MULTIPLE_MATCH)) await generator.multipleMatch();
  } else if (mode === ModeEnum.PRINT_REFERENCE_DATA) {
    await printReferenceData(logger.console, basmApi);
  } else {
    throw Error('Data not generated or printed');
  }
};
