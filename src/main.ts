import {exit} from 'process'
import * as core from '@actions/core'
import * as mackerel from './mackerel.js'

export async function run(): Promise<void> {
  try {
    const httpMethod = mackerel.httpMethod(
      core.getInput('http-method') ?? 'GET'
    )
    if (httpMethod === undefined) {
      core.setFailed('Unrecognised HTTP method')
      exit(1)
    }
    const serverURL = core.getInput('server-url')
    const path = core.getInput('path', {required: true})
    const version = core.getInput('version')
    const url = mackerel.requestURL(serverURL, version, path)

    const apiKey = core.getInput('api-key', {required: true})
    const client = mackerel.apiClient(apiKey)

    const body = core.getInput('body')

    const isDryRun = core.getBooleanInput('dry-run')

    if (isDryRun) {
      core.info('Dry-run. Not call Mackerel API.')
      core.info(`url: ${url}`)
      core.info(`body: ${body}`)
    } else {
      const result = await mackerel.request(client, httpMethod, url, body)
      core.setOutput('result', JSON.stringify(result))
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
