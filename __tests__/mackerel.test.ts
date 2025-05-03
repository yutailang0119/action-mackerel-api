import { jest } from '@jest/globals'
import * as process from 'process'
import * as mackerel from '../src/mackerel.js'

describe('mackerel.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('throws 401', async () => {
    const httpMethod = 'GET'
    const serverURL = 'https://api.mackerelio.com'
    const version = 'v0'
    const path = 'org'
    const url = mackerel.requestURL(serverURL, version, path)

    const apiKey = ''
    const client = mackerel.apiClient(apiKey)

    await expect(mackerel.request(client, httpMethod, url)).rejects.toThrow(
      '401: {"error":{"message":"Authentication failed. Please try with valid Api Key."}}'
    )
  })

  it('throws 404', async () => {
    const httpMethod = 'GET'
    const serverURL = 'https://api.mackerelio.com'
    const version = 'v0'
    const path = 'foobarpiyo'
    const url = mackerel.requestURL(serverURL, version, path)

    const apiKey = ''
    const client = mackerel.apiClient(apiKey)

    await expect(mackerel.request(client, httpMethod, url)).rejects.toThrow(
      '404: {"error":{"message":"Not found."}}'
    )
  })

  it('get', async () => {
    const httpMethod = 'GET'
    const serverURL = 'https://api.mackerelio.com'
    const version = 'v0'
    const path = 'org'
    const url = mackerel.requestURL(serverURL, version, path)

    const apiKey = process.env.TEST_API_KEY ?? ''
    const client = mackerel.apiClient(apiKey)

    const result = await mackerel.request(client, httpMethod, url)
    const orgName = process.env.TEST_ORG_NAME
    expect(result).toEqual(`{"name":"${orgName}","displayName":null}`)
  })

  it('post', async () => {
    const httpMethod = 'POST'
    const serverURL = 'https://api.mackerelio.com'
    const version = 'v0'
    const serviceName = process.env.TEST_SERVICE_NAME
    const path = `services/${serviceName}/tsdb`
    const url = mackerel.requestURL(serverURL, version, path)

    const apiKey = process.env.TEST_API_KEY ?? ''
    const client = mackerel.apiClient(apiKey)

    const time = Date.now() / 1000
    const body = `[{"name": "test-workflow.post", "time": ${time}, "value": ${time}}]`

    const result = await mackerel.request(client, httpMethod, url, body)
    expect(result).toEqual('{"success":true}')
  })
})
