import * as mackerel from '../src/mackerel'

test('throws 401', async () => {
  const httpMethod = 'GET'
  const serverURL = 'https://api.mackerelio.com'
  const version = 'v0'
  const path = 'org'
  const url = mackerel.requestURL(serverURL, version, path)

  const apiKey = ''
  const client = await mackerel.apiClient(apiKey)

  await expect(
    mackerel.request(client, httpMethod, url)
  ).rejects.toThrowError(
    '401: {"error":"Authentication failed. Please try with valid Api Key."}'
  )
})

test('throws 404', async () => {
  const httpMethod = 'GET'
  const serverURL = 'https://api.mackerelio.com'
  const version = 'v0'
  const path = 'foobarpiyo'
  const url = mackerel.requestURL(serverURL, version, path)

  const apiKey = ''
  const client = await mackerel.apiClient(apiKey)

  await expect(
    mackerel.request(client, httpMethod, url)
  ).rejects.toThrowError(
    '404: {"error":"Not found."}'
  )
})

test('get', async () => {
  const httpMethod = 'GET'
  const serverURL = 'https://api.mackerelio.com'
  const version = 'v0'
  const path = 'org'
  const url = mackerel.requestURL(serverURL, version, path)

  const apiKey = process.env.apiKey ?? ''
  const client = await mackerel.apiClient(apiKey)

  const response = await mackerel.request(client, httpMethod, url)
  const org = process.env.org
  expect(response).toEqual(`{"name":"${org}"}`)
})

test('post', async () => {
  const httpMethod = 'POST'
  const serverURL = 'https://api.mackerelio.com'
  const version = 'v0'
  const serviceName = process.env.serviceName
  const path = `services/${serviceName}/tsdb`
  const url = mackerel.requestURL(serverURL, version, path)

  const apiKey = process.env.apiKey ?? ''
  const client = await mackerel.apiClient(apiKey)

  const time = Date.now() / 1000
  const body = `[{"name": "test-workflow.post", "time": ${time}, "value": ${time}}]`

  const response = await mackerel.request(client, httpMethod, url, body)
  expect(response).toEqual('{"success":true}')
})
