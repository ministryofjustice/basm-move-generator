const { data } = require('../data/models');

const prisonNumbers = data.existingPrisonerNumbers.map(i => i.unknown)[Symbol.iterator]();

class CourtReturn {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger;
    this.basmService = basmService;
    this.prisonerSearchService = prisonerSearchService;
  }

  async generate() {
    const prisonNumber = prisonNumbers.next().value;
    await this.prisonerSearchService.validatePrisonNumberCurrentlyIN(prisonNumber);
    const personId = await this.basmService.findPersonByPrisonNumber(prisonNumber);
    const profileId = await this.basmService.createProfile(personId);
    const moveId = await this.basmService.createMoveRemand(profileId);
    await this.basmService.acceptMove(moveId);
    await this.basmService.startMove(moveId);
    await this.basmService.completeMove(moveId);
  }
}
module.exports = async (logger, basmService, prisonerSearchService) => {
  logger.info('Generating From Court Move with Matching Prison Number');
  const fromCourt = new CourtReturn(logger, basmService, prisonerSearchService);
  await fromCourt.generate();
};
