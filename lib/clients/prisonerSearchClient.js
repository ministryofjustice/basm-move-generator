const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');

class PrisonerSearchClient {
  constructor(logger, baseURL, authClient) {
    this.logger = logger;
    this.baseURL = baseURL;
    this.auth = authClient;
    this.client = axios.create({
      timeout: 30000,
      adapter: httpAdapter,
    });
    this.client.interceptors.request.use((request) => {
      logger.info(`PrisonerSearchClient [${request.method}] request - ${request.url}`);
      return request;
    });

    this.client.interceptors.response.use((res) => {
      logger.info(
        `PrisonerSearchClient [${res.config?.method}], status: ${res.status} response - ${res.config?.url}`,
      );
      return res;
    });
  }

  async matchPrisonerByCriteria(body) {
    const token = await this.auth.getToken();
    return this.post(token, '/prisoner-search/match', body);
  }

  async post(token, path, payload) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      (c) => {
        // eslint-disable-next-line no-bitwise
        const r = (Math.random() * 16) | 0;
        // eslint-disable-next-line no-bitwise
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );

    const res = await this.client.post(`${this.baseURL}${path}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'idempotency-key': uuid,
      },
    });
    return res.data;
  }
}

module.exports = { PrisonerSearchClient };
