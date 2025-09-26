const prompts = require('prompts')
const printReferenceData = require('../referenceData')
const { logger } = require('../utils/logger')
const fromCourt = require('./fromCourt')

const ScenariosEnum = {
  FROM_COURT: 'FROM_COURT',
  NO_IDENTIFIERS: 'NO_IDENTIFIERS',
  PNC_ONLY_UNMATCHED: 'PNC_ONLY_UNMATCHED',
  COURT_RETURN: 'COURT_RETURN',
  FROM_CUSTODY_SUITE: 'FROM_CUSTODY_SUITE',
  SINGLE_MATCH: 'SINGLE_MATCH',
  MANUAL_MULTIPLE_MATCH: 'MANUAL_MULTIPLE_MATCH',
  AUTOMATIC_MULTIPLE_MATCH: 'AUTO_MATIC_MULTIPLE_MATCH',
  PRINT_REFERENCE_DATA: 'PRINT_REFERENCE_DATA',
}

const questions = [
  {
    type: 'select',
    name: 'scenario',
    message: 'Choose Scenarios',
    choices: [
      { title: 'From Court', value: ScenariosEnum.FROM_COURT },
      { title: 'No Identifiers', value: ScenariosEnum.NO_IDENTIFIERS },
      { title: 'PNC Only - Unmatched', value: ScenariosEnum.PNC_ONLY_UNMATCHED },
      { title: 'Court Return', value: ScenariosEnum.COURT_RETURN },
      { title: 'From Custody Suite', value: ScenariosEnum.FROM_CUSTODY_SUITE },
      { title: 'Single Match (DO NOT BOOK IN UNLESS NEEDED)', value: ScenariosEnum.SINGLE_MATCH },
      { title: 'Manual Multiple Match (DO NOT BOOK IN UNLESS NEEDED)', value: ScenariosEnum.MANUAL_MULTIPLE_MATCH },
      {
        title: 'Automatic Multiple Match',
        value: ScenariosEnum.AUTOMATIC_MULTIPLE_MATCH,
      },
      { title: 'Print BaSM Reference Data', value: ScenariosEnum.PRINT_REFERENCE_DATA },
    ],
    min: 1,
  },
]

module.exports = async (generator, basmApi) => {
  const { scenario } = await prompts(questions)

  switch (scenario) {
    case ScenariosEnum.FROM_COURT:
      return fromCourt(generator)
    case ScenariosEnum.NO_IDENTIFIERS:
      return generator.fromCourt()
    case ScenariosEnum.PNC_ONLY_UNMATCHED:
      return generator.fromCourtWithUnmatchedPnc()
    case ScenariosEnum.COURT_RETURN:
      return generator.courtReturn()
    case ScenariosEnum.FROM_CUSTODY_SUITE:
      return generator.fromPoliceCustodySuite()
    case ScenariosEnum.SINGLE_MATCH:
      return generator.singleMatch()
    case ScenariosEnum.MANUAL_MULTIPLE_MATCH:
      return generator.manualMultipleMatch()
    case ScenariosEnum.AUTOMATIC_MULTIPLE_MATCH:
      return generator.automaticMultipleMatch()
    case ScenariosEnum.PRINT_REFERENCE_DATA:
      return printReferenceData(logger.console, basmApi)
    default:
      throw Error('Data not generated or printed')
  }
}
