const axios = require('axios')
const httpAdapter = require('axios/lib/adapters/http')
const config = require('../utils/config')

class JsonApiClient {
  constructor(logger, baseURL) {
    this.baseURL = baseURL
    this.client = axios.create({
      timeout: 30000,
      adapter: httpAdapter,
    })
    this.client.interceptors.request.use(request => {
      logger.info(`JsonApiClient [${request.method}] request - ${request.url}`)
      return request
    })

    this.client.interceptors.response.use(res => {
      const method = res.config && res.config.method
      const url = res.config && res.config.method
      logger.info(`JsonApiClient [${method}], status: ${res.status} response - ${url}`)
      return res
    })
  }

  async getToken() {
    const res = await this.client.post(`${this.baseURL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: config.basm.clientId,
      client_secret: config.basm.clientSecret,
    })
    return res.data.access_token
  }

  async getRelative(token, path, { query } = {}) {
    const res = await this.client.get(`${this.baseURL}${path}`, {
      params: query,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.api+json;version=2',
      },
    })
    return res.data
  }

  async post(token, path, payload) {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      // eslint-disable-next-line no-bitwise
      const r = (Math.random() * 16) | 0
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })

    const res = await this.client.post(`${this.baseURL}${path}`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.api+json;version=2',
        'Content-Type': 'application/json',
        'idempotency-key': uuid,
      },
    })
    return res.data
  }

  async getUrl(url, { query } = {}) {
    const res = await this.client.get(url, { params: query })
    return res.data
  }
}

module.exports = {
  JsonApiClient,
}
