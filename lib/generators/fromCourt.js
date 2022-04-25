const chalk = require('chalk');

class FromCourt {
  constructor(logger, basmService) {
    this.logger = logger;
    this.basmService = basmService;
  }

  async generate() {
    const personId = await this.basmService.createPerson();
    // const personId = await this.basmService.getPersonId("G3792UC");
    const profileId = await this.basmService.createProfile(personId);
    await this.basmService.createMoveRemand(profileId);
  }
}

module.exports = async (logger, basmService) => {
  logger.info(chalk.blue('Generating From Court Move'));
  const fromCourt = new FromCourt(logger, basmService);
  await fromCourt.generate();
};
