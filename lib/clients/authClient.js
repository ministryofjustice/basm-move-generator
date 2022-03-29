const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');
const config = require('../utils/config');

class AuthClient {
  constructor(logger, baseURL) {
    this.baseURL = baseURL;
    this.client = axios.create({
      timeout: 30000,
      adapter: httpAdapter,
    });
    this.client.interceptors.request.use((request) => {
      logger.info(`AuthClient [${request.method}] request - ${request.url}`);
      return request;
    });

    this.client.interceptors.response.use((res) => {
      logger.info(
        `AuthClient [${res.config?.method}], status: ${res.status} response - ${res.config?.url}`,
      );
      return res;
    });
  }

  async initToken() {
    const res = await this.client.post(`${this.baseURL}/auth/oauth/token?grant_type=client_credentials`, {}, {
      auth: {
        username: config.auth.clientId,
        password: config.auth.clientSecret,
      },
    });
    this.token = res.data.access_token;
  }

  async getToken() {
    if (!this.token) await this.initToken();
    return this.token;
  }
}

module.exports = { AuthClient };
