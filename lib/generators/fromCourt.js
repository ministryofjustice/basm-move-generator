const chalk = require('chalk')

class FromCourt {
  constructor(logger, basmService) {
    this.logger = logger
    this.basmService = basmService
  }

  async generate(args) {
    const personId = await this.basmService.createPerson(args)
    const profileId = await this.basmService.createProfile(personId)
    await this.basmService.createMoveRemand(profileId)
    return { ...args, personId, profileId }
  }
}

module.exports = async (logger, basmService, args) => {
  logger.info(chalk.blue('Generating From Court Move'))
  const fromCourt = new FromCourt(logger, basmService)
  return fromCourt.generate(args)
}
