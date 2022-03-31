const {
  moves, journeys, random, data, profile, syncProfile, randomPerson,
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
    const from = random(data.courts);
    const move = moves.remand({
      profile: profileId,
      date: new Date(),
      fromLocation: from,
      toLocation: data.toPrison.value,
    });
    return this.createMove(move, from);
  }

  async createMoveRecall(profileId) {
    const from = random(data.policeCustodaySuites);
    const move = moves.recall({
      profile: profileId,
      date: new Date(),
      fromLocation: from,
      toLocation: data.toPrison.value,
    });
    return this.createMove(move, from);
  }

  async createMove(move, from) {
    const { id } = await this.api.post('/api/moves', move);

    this.logger.info(`Created move: ${id}`);

    await this.api.post(`/api/moves/${id}/accept`, moves.accept());

    const moveStart = await this.addHours(new Date(), 1);
    await this.api.post(`/api/moves/${id}/start`, moves.start({
      startedAt: moveStart,
    }));

    this.logger.info(`Move ${id} started at: ${moveStart}`);

    const moveComplete = await this.addHours(moveStart, 1);
    await this.api.post(`/api/moves/${id}/complete`, moves.complete({
      completedAt: moveComplete,
    }));

    this.logger.info(`Move ${id} completed at: ${moveComplete}`);

    await this.createJourney(id, from, moveStart, moveComplete);

    return id;
  }

  async createJourney(moveId, from, startedAt, completedAt) {
    const { id } = await this.api.post(`/api/moves/${moveId}/journeys`, journeys.proposed({
      fromLocation: from,
      toLocation: data.toPrison.value,
    }));

    await this.api.post('/api/events', journeys.inProgress({
      journeyId: id,
      occurredAt: startedAt,
    }));

    await this.api.post('/api/events', journeys.complete({
      journeyId: id,
      occurredAt: completedAt,
    }));

    this.logger.info(`Created completed journey: ${id}`);
  }

  async createProfile(personId) {
    const { id } = await this.api.post(`/api/people/${personId}/profiles`, profile());
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async findPersonByPrisonNumber(prisonNumber) {
    const { id } = (await this.api.getRaw(`/api/people?filter[prison_number]=${prisonNumber}`))[0];

    this.logger.info(`Found person with offender number: ${prisonNumber} and id: ${id})`);
    return id;
  }

  async findPersonByPnc(pnc) {
    const person = (await this.api.getRaw(`/api/people?filter[police_national_computer]=${pnc}`))[0];

    const {
      id, firstNames, lastName, dateOfBirth, gender,
    } = person;

    this.logger.info(`Found person: ${firstNames} ${lastName} (${dateOfBirth}, ${gender})`);
    return id;
  }

  async syncProfile(personId) {
    const { id } = await this.api.post(`/api/people/${personId}/profiles`, syncProfile());
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async createPerson(args = {}) {
    const person = await this.api.post('/api/people', randomPerson(args));
    const {
      id, firstNames, lastName, dateOfBirth,
    } = person;
    this.logger.info(`Created person: ${firstNames} ${lastName} (${dateOfBirth})`);
    return id;
  }

  async getPersonId(prisonNumber) {
    const result = await this.api.getFirst({
      path: () => `/api/people?filter[prison_number]=${prisonNumber}`,
      transform: it => it,
    });
    const {
      id, firstNames, lastName, dateOfBirth, gender,
    } = result;
    this.logger.info(`Found person: ${firstNames} ${lastName} (${dateOfBirth}, ${gender})`);
    return id;
  }

  async addHours(date, hours) {
    this.logger.info(`date ${date})`);

    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
  }
}

module.exports = { BasmService };
