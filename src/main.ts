import {exit} from 'process'
import * as core from '@actions/core'
import * as mackerel from './mackerel'

async function run(): Promise<void> {
  try {
    const httpMethod = mackerel.httpMethod(
      core.getInput('http_method') ?? 'GET'
    )
    if (httpMethod === undefined) {
      core.setFailed('Unrecognised HTTP method')
      exit(1)
    }
    const serverURL = core.getInput('server_url')
    const path = core.getInput('path', {required: true})
    const version = core.getInput('version')
    const url = mackerel.requestURL(serverURL, version, path)

    const apiKey = core.getInput('api_key', {required: true})
    const client = mackerel.apiClient(apiKey)

    const body = core.getInput('body')

    const result = await mackerel.request(client, httpMethod, url, body)

    core.setOutput('result', JSON.stringify(result))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
