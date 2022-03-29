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

  async validatePrisonNumberCurrentlyIN(prisonNumber) {
    const results = await this.api.matchPrisonerByCriteria({ prisonerIdentifier: prisonNumber });
    if (results[0].inOutStatus !== 'IN') {
      this.logger.warn(`${prisonNumber} is not currently IN prison. This may need updating`);
    }
  }
}

module.exports = { PrisonerSearchService };
