const chalk = require('chalk')
const { random, data } = require('../data/models')

class FromPoliceCustodySuite {
  constructor(logger, basmService) {
    this.logger = logger
    this.basmService = basmService
  }

  async generate() {
    const personId = await this.basmService.findPersonByPrisonNumber(random(data.existingPrisonerNumbers))
    const profileId = await this.basmService.syncProfile(personId)
    await this.basmService.createMoveRecall(profileId)
  }
}
module.exports = async (logger, basmService) => {
  logger.info(chalk.blue('Generating From Police Custody Suite Move'))
  const fromPoliceCustodySuite = new FromPoliceCustodySuite(logger, basmService)
  await fromPoliceCustodySuite.generate()
}
