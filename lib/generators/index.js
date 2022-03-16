const fromCourt = require('./fromCourt');
const fromCourtWithPnc = require('./fromCourtWithPnc');
const fromPoliceCustodySuite = require('./fromPoliceCustodySuite');

module.exports = class Generator {
  constructor(logger, basmService) {
    this.logger = logger;
    this.basmService = basmService;
  }

  async fromCourt() {
    await fromCourt(this.logger, this.basmService);
  }

  async fromCourtWithPnc() {
    await fromCourtWithPnc(this.logger, this.basmService);
  }

  async fromPoliceCustodySuite() {
    await fromPoliceCustodySuite(this.logger, this.basmService);
  }
};
