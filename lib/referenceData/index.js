class ReferenceDataLookup {
  constructor(logger, basmApi) {
    this.logger = logger;
    this.api = basmApi;
  }

  async findPeople() {
    const people = await this.api.getRaw('/api/people?per_page=1000');

    console.log(
      people
        .filter((p) => Boolean(p.prisonNumber))
        .filter((p) => p.prisonNumber.match(/[A-Z][0-9]{4}[A-Z]{1,2}/g)),
    );
  }

  async findPrisons() {
    const prisons = await this.api.getRaw(
      '/api/reference/locations?per_page=100&filter[location_type]=prison',
    );

    console.log(
      prisons
        .filter((p) => !p.disabledAt)
        .map(({ id, title }) => ({
          [title
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[()]/g, '')
            .replace(/[&]/g, 'and')
            .replace(/\//g, '_')]: id,
        })),
    );
  }

  async findCourts() {
    const courts = await this.api.getRaw(
      '/api/reference/locations?per_page=1000&filter[location_type]=court',
    );

    const filteredCourts = courts
      .filter((p) => !p.disabledAt)
      .filter(({ title }) => !title.toLowerCase().includes('marke'))
      .filter(({ title }) => !title.toLowerCase().includes('mike'))
      .filter(({ title }) => !title.toLowerCase().includes('mwillis'))

      .map(({ id, title }) => ({
        [title
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[()]/g, '')
          .replace(/[&]/g, 'and')
          .replace(/[-]/g, '')
          .replace(/[_]+/g, '_')
          .replace(/[.]+/g, '')
          .replace(/[']+/g, '')
          .replace(/\//g, '_')]: id,
      }));

    const shuffled = filteredCourts.sort(() => 0.5 - Math.random());
    const sortedSlice = shuffled
      .slice(0, 50)
      .sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]));
    console.log(sortedSlice);
  }

  async findPolice() {
    const police = await this.api.getRaw(
      '/api/reference/locations?per_page=1000&filter[location_type]=police',
    );

    const filteredPolice = police
      .filter((p) => !p.disabledAt)

      .map(({ id, title }) => ({
        [title
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[()]/g, '')
          .replace(/[&]/g, 'and')
          .replace(/[-]/g, '')
          .replace(/[_]+/g, '_')
          .replace(/[.]+/g, '')
          .replace(/[']+/g, '')
          .replace(/\//g, '_')]: id,
      }));

    const shuffled = filteredPolice.sort(() => 0.5 - Math.random());
    const sortedSlice = shuffled
      .slice(0, 50)
      .sort((a, b) => Object.keys(a)[0].localeCompare(Object.keys(b)[0]));
    console.log(sortedSlice);
  }

  async findEthnicities() {
    const ethnicities = await this.api.getRaw(
      '/api/reference/ethnicities?per_page=100',
    );

    console.log(
      ethnicities
        .filter((p) => !p.disabledAt)
        .map(({ id, title }) => ({
          [title
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/:/g, '')
            .replace(/.*?\//, '')
            .replace(/'/g, '')
            .replace(/\//g, '_')
            .replace(/\./g, '')]: id,
        })),
    );
  }
}
module.exports = async (logger, basmApi) => {
  const lookup = new ReferenceDataLookup(logger, basmApi);
  await lookup.findPeople();
  await lookup.findPrisons();
  await lookup.findEthnicities();
  await lookup.findCourts();
  await lookup.findPolice();
};
