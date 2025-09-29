const chalk = require('chalk')
const { data } = require('../data/models')

const prisonNumbers = data.existingPrisonerNumbers.map(i => i.unknown)[Symbol.iterator]()

class CourtReturn {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger
    this.basmService = basmService
    this.prisonerSearchService = prisonerSearchService
  }

  async generate() {
    try {
      const { inOutStatus, prisonerNumber, lastMovementTypeCode } =
        await this.prisonerSearchService.findFirstRecordByStatus(prisonNumbers, 'ACTIVE')
      if (inOutStatus !== 'OUT') {
        this.logger.warn(
          chalk.yellow(
            `${prisonerNumber} is not currently OUT of prison. The Scenario can be viewed but not confirmed`,
          ),
        )
      }
      if (lastMovementTypeCode !== 'CRT') {
        this.logger.warn(
          chalk.yellow(
            `${prisonerNumber} does not have a lastMovementTypeCode of CRT (Actual: ${lastMovementTypeCode}). The Scenario can be viewed but not confirmed`,
          ),
        )
      }
      const personId = await this.basmService.findPersonByPrisonNumber(prisonerNumber)
      const profileId = await this.basmService.createProfile(personId)
      await this.basmService.createMoveRemand(profileId)
    } catch (e) {
      this.logger.error(chalk.red('Could not create Court Return, see logs'), e)
    }
  }
}
module.exports = async (logger, basmService, prisonerSearchService) => {
  logger.info(chalk.blue('Generating From Court Move with Matching Prison Number'))
  const fromCourt = new CourtReturn(logger, basmService, prisonerSearchService)
  await fromCourt.generate()
}
