const {
  random, data, profile, moves,
} = require('../data/models');

const pncs = data.existingPNCs.map((i) => i.unknown)[Symbol.iterator]();

class FromCourtWithPnc {
  constructor(logger, basmApi) {
    this.logger = logger;
    this.api = basmApi;
  }

  async findPerson() {
    const pnc = pncs.next().value;
    const person = (
      await this.api.getRaw(
        `/api/people?filter[police_national_computer]=${pnc}`,
      )
    )[0];

    const {
      id, firstNames, lastName, dateOfBirth, gender,
    } = person;

    this.logger.info(
      `Found person: ${firstNames} ${lastName} (${dateOfBirth}, ${gender})`,
    );
    return id;
  }

  async createProfile(personId) {
    const { id } = await this.api.post(
      `/api/people/${personId}/profiles`,
      profile(),
    );
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async createMove(profileId) {
    const move = moves.remand({
      profile: profileId,
      date: new Date(),
      fromLocation: random(data.courts),
      toLocation: data.toPrison.value,
    });
    const result = await this.api.post('/api/moves', move);
    this.logger.info(`Created move: ${result?.id}`);
    return result?.id;
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
    const profileId = await this.createProfile(personId);
    const moveId = await this.createMove(profileId);
    await this.acceptMove(moveId);
    await this.startMove(moveId);
    await this.completeMove(moveId);
  }
}
module.exports = async (logger, basmApi) => {
  logger.info('Generating From Court Move with PNC');
  const fromCourt = new FromCourtWithPnc(logger, basmApi);
  await fromCourt.generate();
};
