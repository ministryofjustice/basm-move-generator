const {
  data,
} = require('../data/models');

const pncs = data.unmatchedPNCs.map((i) => i.unknown);

class FromCourtWithUnmatchedPnc {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger;
    this.basmService = basmService;
    this.prisonerSearchService = prisonerSearchService;
  }

  async generate() {
    const unmatchedPnc = await this.prisonerSearchService.findUnmatchedPnc(pncs);
    const personId = await this.basmService.createPerson({ police_national_computer: unmatchedPnc });
    const profileId = await this.basmService.createProfile(personId);
    const moveId = await this.basmService.createMoveRemand(profileId);
    await this.basmService.acceptMove(moveId);
    await this.basmService.startMove(moveId);
    await this.basmService.completeMove(moveId);
  }
}
module.exports = async (logger, basmService, prisonerSearchService) => {
  logger.info('Generating From Court Move with Unmatched PNC');
  const fromCourt = new FromCourtWithUnmatchedPnc(logger, basmService, prisonerSearchService);
  await fromCourt.generate();
};
