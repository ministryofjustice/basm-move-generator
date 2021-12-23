const { getEnv } = require('./index');
require('dotenv').config();

module.exports = {
  apiEndpoint: getEnv('BASM_API_URL', { requireInProduction: true }),
  clientId: getEnv('BASM_CLIENT_ID', { requireInProduction: true }),
  clientSecret: getEnv('BASM_CLIENT_SECRET', {
    requireInProduction: true,
  }),
};
