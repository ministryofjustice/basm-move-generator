const chalk = require('chalk');
const { staticPerson } = require('../data/models');

class MultipleMatch {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger;
    this.basmService = basmService;
    this.prisonerSearchService = prisonerSearchService;
  }

  async generate() {
    const personId = await this.basmService.createPerson(staticPerson());
    const profileId = await this.basmService.createProfile(personId);
    await this.basmService.createMoveRemand(profileId);
  }
}
module.exports = async (logger, basmService, prisonerSearchService) => {
  logger.info(chalk.blue('Generating From Court Move with Multiple Matches'));
  logger.info(chalk.bgRed('Do Not Book In The Offender Unless Required - See README.md For More Info'));
  const singleMatch = new MultipleMatch(logger, basmService, prisonerSearchService);
  await singleMatch.generate();
};
