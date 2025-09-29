const { Jsona, SwitchCaseJsonMapper } = require('jsona')

const dataFormatter = new Jsona({
  jsonPropertiesMapper: new SwitchCaseJsonMapper({
    camelizeAttributes: true,
    camelizeRelationships: true,
    camelizeType: false,
    camelizeMeta: true,
    switchChar: '_',
  }),
})

class BasmApi {
  constructor(jsonApiClient) {
    this.jsonApiClient = jsonApiClient
  }

  async initToken() {
    this.token = await this.jsonApiClient.getToken()
  }

  async getRaw(path) {
    const response = await this.jsonApiClient.getRelative(this.token, path)

    const deserializedResponse = dataFormatter.deserialize(response)

    return deserializedResponse
  }

  async get(query) {
    const response = await this.jsonApiClient.getRelative(this.token, query.path())

    const deserializedResponse = dataFormatter.deserialize(response)

    if (Array.isArray(deserializedResponse)) {
      return deserializedResponse.map(item => query.transform(item))
    }
    return query.transform(deserializedResponse)
  }

  async post(path, payload) {
    const response = await this.jsonApiClient.post(this.token, path, payload)
    return response ? dataFormatter.deserialize(response) : null
  }

  async getFirst(query) {
    const result = await this.get(query)
    return result[0]
  }
}

module.exports = { BasmApi }
