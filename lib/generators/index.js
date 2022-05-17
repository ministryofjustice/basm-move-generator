const fromCourt = require('./fromCourt');
const courtReturn = require('./courtReturn');
const fromCourtWithUnmatchedPnc = require('./fromCourtWithUnmatchedPnc');
const fromPoliceCustodySuite = require('./fromPoliceCustodySuite');
const singleMatch = require('./singleMatch');
const multipleMatch = require('./multipleMatch');

module.exports = class Generator {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger;
    this.basmService = basmService;
    this.prisonerSearchService = prisonerSearchService;
  }

  async fromCourt() {
    await fromCourt(this.logger, this.basmService);
  }

  async courtReturn() {
    await courtReturn(this.logger, this.basmService, this.prisonerSearchService);
  }

  async fromCourtWithUnmatchedPnc() {
    await fromCourtWithUnmatchedPnc(this.logger, this.basmService, this.prisonerSearchService);
  }

  async fromPoliceCustodySuite() {
    await fromPoliceCustodySuite(this.logger, this.basmService);
  }

  async singleMatch() {
    await singleMatch(this.logger, this.basmService, this.prisonerSearchService);
  }

  async multipleMatch() {
    await multipleMatch(this.logger, this.basmService, this.prisonerSearchService);
  }
};
