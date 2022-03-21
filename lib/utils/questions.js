const ModeEnum = { GENERATE: 'GENERATE', PRINT_REFERENCE_DATA: 'PRINT_REFERENCE_DATA' };
const ScenariosEnum = { NO_IDENTIFIERS: 'NO_IDENTIFIERS', PNC_ONLY: 'PNC_ONLY', FROM_CUSTODY_SUITE: 'FROM_CUSTODY_SUITE' };

const multiselectIfGenerateElseSkip = (previousAnswer) => (previousAnswer === ModeEnum.GENERATE ? 'multiselect' : false);

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
      { title: 'PNC Only', value: ScenariosEnum.PNC_ONLY },
      { title: 'From Custody Suite', value: ScenariosEnum.FROM_CUSTODY_SUITE },
    ],
    min: 1,
  },
];

module.exports = { questions, ModeEnum, ScenariosEnum };
