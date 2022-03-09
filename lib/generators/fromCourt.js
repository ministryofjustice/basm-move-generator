class FromCourt {
  constructor(logger, basmService) {
    this.logger = logger;
    this.basmService = basmService;
  }

  async generate() {
    const personId = await this.basmService.createPerson();
    // const personId = await this.basmService.getPersonId("G3792UC");
    const profileId = await this.basmService.createProfile(personId);
    const moveId = await this.basmService.createMoveRemand(profileId);
    await this.basmService.acceptMove(moveId);
    await this.basmService.startMove(moveId);
    await this.basmService.completeMove(moveId);
  }
}

module.exports = async (logger, basmService) => {
  logger.info('Generating From Court Move');
  const fromCourt = new FromCourt(logger, basmService);
  await fromCourt.generate();
};
