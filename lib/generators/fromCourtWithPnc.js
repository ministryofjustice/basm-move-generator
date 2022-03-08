const {
  data,
} = require('../data/models');

const pncs = data.existingPNCs.map((i) => i.unknown)[Symbol.iterator]();

class FromCourtWithPnc {
  constructor(logger, basmApi, basmService) {
    this.logger = logger;
    this.api = basmApi;
    this.basmService = basmService;
  }

  async generate() {
    const personId = await this.basmService.findPersonByPnc(pncs.next().value);
    const profileId = await this.basmService.createProfile(personId);
    const moveId = await this.basmService.createMoveRemand(profileId);
    await this.basmService.acceptMove(moveId);
    await this.basmService.startMove(moveId);
    await this.basmService.completeMove(moveId);
  }
}
module.exports = async (logger, basmApi, basmService) => {
  logger.info('Generating From Court Move with PNC');
  const fromCourt = new FromCourtWithPnc(logger, basmApi, basmService);
  await fromCourt.generate();
};
