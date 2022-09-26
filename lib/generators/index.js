const fromCourt = require('./fromCourt');
const courtReturn = require('./courtReturn');
const fromCourtWithUnmatchedPnc = require('./fromCourtWithUnmatchedPnc');
const fromPoliceCustodySuite = require('./fromPoliceCustodySuite');
const singleMatch = require('./singleMatch');
const manualMultipleMatch = require('./manualMultipleMatch');
const automaticMultipleMatch = require('./automaticMultipleMatch');

module.exports = class Generator {
  constructor(logger, basmService, prisonerSearchService) {
    this.logger = logger;
    this.basmService = basmService;
    this.prisonerSearchService = prisonerSearchService;
  }

  async fromCourt(args) {
    return fromCourt(this.logger, this.basmService, args);
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

  async manualMultipleMatch() {
    await manualMultipleMatch(this.logger, this.basmService);
  }

  async automaticMultipleMatch() {
    await automaticMultipleMatch(this.logger, this.basmService);
  }
};
