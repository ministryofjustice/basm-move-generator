const fromCourt = require('./fromCourt');
const fromCourtWithPnc = require('./fromCourtWithPnc');
const fromPoliceCustodySuite = require('./fromPoliceCustodySuite');

module.exports = class Generator {
  constructor(logger, api, basmService) {
    this.api = api;
    this.logger = logger;
    this.basmService = basmService;
  }

  async fromCourt() {
    await fromCourt(this.logger, this.api, this.basmService);
  }

  async fromCourtWithPnc() {
    await fromCourtWithPnc(this.logger, this.api, this.basmService);
  }

  async fromPoliceCustodySuite() {
    await fromPoliceCustodySuite(this.logger, this.api, this.basmService);
  }
};
