const fromCourt = require('./fromCourt');
const fromCourtWithPnc = require('./fromCourtWithPnc');
const fromPoliceCustodySuite = require('./fromPoliceCustodySuite');

module.exports = class Generator {
  constructor(logger, api) {
    this.api = api;
    this.logger = logger;
  }

  fromCourt() {
    fromCourt(this.logger, this.api);
  }

  fromCourtWithPnc() {
    fromCourtWithPnc(this.logger, this.api);
  }

  fromPoliceCustodySuite() {
    fromPoliceCustodySuite(this.logger, this.api);
  }
};
