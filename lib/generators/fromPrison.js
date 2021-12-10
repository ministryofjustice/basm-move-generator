const {
  random, data, moves, syncProfile,
} = require('../data/models');

class FromPrison {
  constructor(logger, basmApi) {
    this.logger = logger;
    this.api = basmApi;
  }

  async findPerson() {
    const prisonNumber = random(data.existingPrisonerNumbers);
    const { id } = (
      await this.api.getRaw(`/api/people?filter[prison_number]=${prisonNumber}`)
    )[0];

    this.logger.info(
      `Found person with offender number: ${prisonNumber} and id: ${id})`,
    );

    return id;
  }

  async syncProfile(personId) {
    const { id } = await this.api.post(
      `/api/people/${personId}/profiles`,
      syncProfile(),
    );
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async createMove(profileId) {
    const move = moves.transfer({
      profile: profileId,
      date: new Date(),
      fromLocation: random(data.prisons),
      toLocation: data.toPrison.value,
    });

    const result = await this.api.post('/api/moves', move);
    this.logger.info(`Created move: ${result?.id}`);
    return result?.id;
  }

  async approveMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/approve`, moves.approve());
    this.logger.info(`Approved move: ${moveId}`);
  }

  async acceptMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/accept`, moves.accept());
    this.logger.info(`Accepted move: ${moveId}`);
  }

  async startMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/start`, moves.start());
    this.logger.info(`Started move: ${moveId}`);
  }

  async completeMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/complete`, moves.complete());
    this.logger.info(`Completed move: ${moveId}`);
  }

  async generate() {
    const personId = await this.findPerson();
    const profileId = await this.syncProfile(personId);
    const moveId = await this.createMove(profileId);
    await this.approveMove(moveId);
    await this.acceptMove(moveId);
    await this.startMove(moveId);
    await this.completeMove(moveId);
  }
}
module.exports = async (logger, basmApi) => {
  logger.info('Generating From Prison Move');
  const fromPrison = new FromPrison(logger, basmApi);
  await fromPrison.generate();
};
