const chalk = require('chalk')
const { data } = require('../data/models')

const prisonNumbers = data.existingPrisonerNumbers.map(i => i.unknown)[Symbol.iterator]()

class SingleMatch {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger
    this.basmService = basmService
    this.prisonerSearchService = prisonerSearchService
  }

  async generate() {
    try {
      const { firstName, lastName, dateOfBirth, pncNumber, prisonerNumber } =
        await this.prisonerSearchService.findFirstRecordByStatus(prisonNumbers, 'INACTIVE OUT')
      const personId = await this.basmService.createPerson({
        firstName,
        lastName,
        dob: dateOfBirth,
        police_national_computer: pncNumber,
        prison_number: prisonerNumber,
      })
      const profileId = await this.basmService.createProfile(personId)
      await this.basmService.createMoveRemand(profileId)
    } catch (e) {
      this.logger.error(chalk.red('Could not create Single Match, see logs'), e)
    }
  }
}
module.exports = async (logger, basmService, prisonerSearchService) => {
  logger.info(chalk.blue('Generating From Court Move with Single Match'))
  logger.info(chalk.bgRed('Do Not Book In The Offender Unless Required - See README.md For More Info'))
  const singleMatch = new SingleMatch(logger, basmService, prisonerSearchService)
  await singleMatch.generate()
}
