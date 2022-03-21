const {
  random, data,
} = require('../data/models');

class FromPoliceCustodySuite {
  constructor(logger, basmService) {
    this.logger = logger;
    this.basmService = basmService;
  }

  async generate() {
    const personId = await this.basmService.findPersonByPrisonNumber(random(data.existingPrisonerNumbers));
    const profileId = await this.basmService.syncProfile(personId);
    const moveId = await this.basmService.createMoveRecall(profileId);
    await this.basmService.acceptMove(moveId);
    await this.basmService.startMove(moveId);
    await this.basmService.completeMove(moveId);
  }
}
module.exports = async (logger, basmService) => {
  logger.info('Generating From Police Custody Suite Move');
  const fromPoliceCustodySuite = new FromPoliceCustodySuite(logger, basmService);
  await fromPoliceCustodySuite.generate();
};
