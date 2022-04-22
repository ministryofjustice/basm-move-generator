class PrisonerSearchService {
  constructor(logger, prisonClient) {
    this.logger = logger;
    this.api = prisonClient;
  }

  async isUnmatchedIdentifier(identifier) {
    const results = await this.api.matchPrisonerByCriteria({ prisonerIdentifier: identifier });
    return results.length === 0;
  }

  async findUnmatchedIdentifier(identifiers) {
    // eslint-disable-next-line no-restricted-syntax
    for (const identifier of identifiers) {
      // eslint-disable-next-line no-await-in-loop
      const isUnmatchedIdentifier = await this.isUnmatchedIdentifier(identifier);
      if (isUnmatchedIdentifier) return identifier;
    }
    return false;
  }

  async findUnmatchedPnc(pncs) {
    const unmatchedPnc = await this.findUnmatchedIdentifier(pncs);
    if (unmatchedPnc) return unmatchedPnc;
    throw new Error('All PNCs were matched, the unmatchedPNCs list needs updating');
  }

  async findFirstRecordByStatus(identifiers, status) {
    let identifier = identifiers.next();
    while (!identifier.done) {
      // eslint-disable-next-line no-await-in-loop
      const results = await this.api.matchPrisonerByCriteria({ prisonerIdentifier: identifier.value });
      if (results.length > 0 && results[0].status.startsWith(status)) return results[0];
      identifier = identifiers.next();
    }
    throw new Error(`No records are currently ${status}, data may need updating`);
  }
}

module.exports = { PrisonerSearchService };
