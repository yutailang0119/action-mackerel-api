import * as core from '@actions/core'
import * as mackerel from './mackerel'
import {exit} from 'process'

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
    const client = await mackerel.apiClient(apiKey)

    const body = core.getInput('body')

    const response = await mackerel.request(client, httpMethod, url, body)

    core.setOutput('response', JSON.stringify(response))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
