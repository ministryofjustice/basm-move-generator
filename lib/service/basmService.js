const {
  moves, random, data, profile, syncProfile, randomPerson,
} = require('../data/models');

class BasmService {
  constructor(logger, basmApi) {
    this.logger = logger;
    this.api = basmApi;
  }

  async initToken() {
    await this.api.initToken();
  }

  async createMoveRemand(profileId) {
    const move = moves.remand({
      profile: profileId,
      date: new Date(),
      fromLocation: random(data.courts),
      toLocation: data.toPrison.value,
    });
    return this.createMove(move);
  }

  async createMoveRecall(profileId) {
    const move = moves.recall({
      profile: profileId,
      date: new Date(),
      fromLocation: random(data.policeCustodaySuites),
      toLocation: data.toPrison.value,
    });
    return this.createMove(move);
  }

  async createMove(move) {
    const result = await this.api.post('/api/moves', move);
    this.logger.info(`Created move: ${result?.id}`);
    return result?.id;
  }

  async startMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/start`, moves.start());
    this.logger.info(`Started move: ${moveId}`);
  }

  async acceptMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/accept`, moves.accept());
    this.logger.info(`Accepted move: ${moveId}`);
  }

  async completeMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/complete`, moves.complete());
    this.logger.info(`Completed move: ${moveId}`);
  }

  async createProfile(personId) {
    const { id } = await this.api.post(
      `/api/people/${personId}/profiles`,
      profile(),
    );
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async findPersonByPrisonNumber(prisonNumber) {
    const { id } = (
      await this.api.getRaw(`/api/people?filter[prison_number]=${prisonNumber}`)
    )[0];

    this.logger.info(
      `Found person with offender number: ${prisonNumber} and id: ${id})`,
    );
    return id;
  }

  async findPersonByPnc(pnc) {
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

  async syncProfile(personId) {
    const { id } = await this.api.post(
      `/api/people/${personId}/profiles`,
      syncProfile(),
    );
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async createPerson() {
    const person = await this.api.post('/api/people', randomPerson());
    const {
      id, firstNames, lastName, dateOfBirth,
    } = person;
    this.logger.info(
      `Created person: ${firstNames} ${lastName} (${dateOfBirth})`,
    );
    return id;
  }

  async getPersonId(prisonNumber) {
    const result = await this.api.getFirst({
      path: () => `/api/people?filter[prison_number]=${prisonNumber}`,
      transform: (it) => it,
    });
    const {
      id, firstNames, lastName, dateOfBirth, gender,
    } = result;
    this.logger.info(
      `Found person: ${firstNames} ${lastName} (${dateOfBirth}, ${gender})`,
    );
    return id;
  }
}

module.exports = { BasmService };
