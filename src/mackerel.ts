import * as http from '@actions/http-client'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export function httpMethod(method: string): HttpMethod | undefined {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'GET'
    case 'POST':
      return 'POST'
    case 'PUT':
      return 'PUT'
    case 'DELETE':
      return 'DELETE'
    default:
      return undefined
  }
}

export async function apiClient(apiKey: string): Promise<http.HttpClient> {
  const client = new http.HttpClient('action-mackerel-api')
  client.requestOptions = {
    headers: {
      'X-Api-Key': apiKey
    }
  }
  return client
}

export function requestURL(
  serverURL: string,
  version: string,
  path: string
): URL {
  const url = new URL(`api/${version}/${path}`, serverURL)
  return url
}

export async function request(
  client: http.HttpClient,
  method: HttpMethod,
  url: URL,
  body?: string
): Promise<string> {
  let res: http.HttpClientResponse
  const additionalHeaders: {[key: string]: string} = {}
  additionalHeaders[http.Headers.ContentType] = http.MediaTypes.ApplicationJson
  switch (method) {
    case 'GET':
      res = await client.get(url.toString())
      break
    case 'POST':
      res = await client.post(url.toString(), body ?? '', additionalHeaders)
      break
    case 'PUT':
      res = await client.put(url.toString(), body ?? '', additionalHeaders)
      break
    case 'DELETE':
      res = await client.del(url.toString())
      break
  }

  const result = await res.readBody()
  const statusCode = res.message.statusCode ?? 400
  if (statusCode < 200 || statusCode > 299) {
    throw new Error(`${statusCode}: ${result}`)
  }

  return result
}
