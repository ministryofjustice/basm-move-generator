const { getEnv } = require('./index')
require('dotenv').config()

module.exports = {
  basm: {
    apiEndpoint: getEnv('BASM_API_URL', { requireInProduction: true }),
    clientId: getEnv('BASM_CLIENT_ID', { requireInProduction: true }),
    clientSecret: getEnv('BASM_CLIENT_SECRET', {
      requireInProduction: true,
    }),
    toPrison: getEnv('BASM_TO_PRISON', { requireInProduction: true }),
  },
  auth: {
    apiEndpoint: getEnv('AUTH_API_URL', { requireInProduction: true }),
    clientId: getEnv('AUTH_CLIENT_ID', { requireInProduction: true }),
    clientSecret: getEnv('AUTH_CLIENT_SECRET', {
      requireInProduction: true,
    }),
  },
  prisonerSearch: {
    apiEndpoint: getEnv('PRISONER_SEARCH_URL', { requireInProduction: true }),
  },
}
