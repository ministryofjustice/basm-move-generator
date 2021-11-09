const {
  random,
  data,
  profile,
  moves,
  randomPerson,
} = require("../data/models");

class FromCourt {
  constructor(logger, basmApi) {
    this.logger = logger;
    this.api = basmApi;
  }

  async #createPerson() {
    const { id, firstNames, lastName, dateOfBirth } = await this.api.post(
      "/api/people",
      randomPerson()
    );
    this.logger.info(
      `Created person: ${firstNames} ${lastName} (${dateOfBirth})`
    );
    return id;
  }

  async #getPersonId(prisonNumber) {
    const result = await this.api.getFirst({
      path: () => `/api/people?filter[prison_number]=${prisonNumber}`,
      transform: (it) => it,
    });
    const { id, firstNames, lastName, dateOfBirth } = result;
    this.logger.info(
      `Found person: ${firstNames} ${lastName} (${dateOfBirth})`
    );
    return id;
  }

  async #createProfile(personId) {
    const { id } = await this.api.post(
      `/api/people/${personId}/profiles`,
      profile()
    );
    this.logger.info(`Created profile: ${id}`);
    return id;
  }

  async #createMove(profileId) {
    const move = moves.remand({
      profile: profileId,
      date: new Date(),
      fromLocation: random(data.courts),
      toLocation: data.toPrison.value,
    });
    const result = await this.api.post(`/api/moves`, move);
    this.logger.info(`Created move: ${result?.id}`);
    return result?.id;
  }

  async #acceptMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/accept`, moves.accept());
    this.logger.info(`Accepted move: ${moveId}`);
  }

  async #startMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/start`, moves.start());
    this.logger.info(`Started move: ${moveId}`);
  }

  async #completeMove(moveId) {
    await this.api.post(`/api/moves/${moveId}/complete`, moves.complete());
    this.logger.info(`Completed move: ${moveId}`);
  }

  async generate() {
    const personId = await this.#createPerson();
    // const personId = await this.#getPersonId("G3792UC");
    const profileId = await this.#createProfile(personId);
    const moveId = await this.#createMove(profileId);
    await this.#acceptMove(moveId);
    await this.#startMove(moveId);
    await this.#completeMove(moveId);
  }
}

module.exports = async (logger, basmApi) => {
  logger.info("Generating From Court Move");
  const fromCourt = new FromCourt(logger, basmApi);
  await fromCourt.generate();
};
