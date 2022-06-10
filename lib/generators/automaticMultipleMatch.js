const chalk = require('chalk');
const { staticPerson } = require('../data/models');

class AutomaticMultipleMatch {
  constructor(logger, basmService) {
    this.logger = logger;
    this.basmService = basmService;
  }

  async generate() {
    const personId = await this.basmService.createPerson(staticPerson({ police_national_computer: '09/222376Z' }));
    const profileId = await this.basmService.createProfile(personId);
    await this.basmService.createMoveRemand(profileId);
  }
}
module.exports = async (logger, basmService) => {
  logger.info(chalk.blue('Generating From Court Move with Automatic Multiple Matches'));
  logger.info(chalk.bgRed('Do Not Book In The Offender Unless Required - See README.md For More Info'));
  const singleMatch = new AutomaticMultipleMatch(logger, basmService);
  await singleMatch.generate();
};
