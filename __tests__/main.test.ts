import { jest } from '@jest/globals'
import * as process from 'process'
import { expect } from '@jest/globals'
import * as core from '../__fixtures__/core.js'

jest.unstable_mockModule('@actions/core', () => core)

const { run } = await import('../src/main.js')

// shows how the runner will run a javascript action with env / stdout protocol
describe('main.ts', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('test runs', async () => {
    core.getInput.mockImplementation((name) => {
      switch (name) {
        case 'server-url':
          return 'https://api.mackerelio.com'
        case 'api-key':
          return process.env.TEST_API_KEY ?? ''
        case 'http-method':
          return 'GET'
        case 'version':
          return 'v0'
        case 'path':
          return 'org'
        default:
          return ''
      }
    })
    core.getBooleanInput.mockImplementation((name) => {
      switch (name) {
        case 'dry-run':
          return false
        default:
          return false
      }
    })

    const orgName = process.env.TEST_ORG_NAME

    await run()

    expect(core.setOutput).toHaveBeenNthCalledWith(
      1,
      'result',
      `\"{\\\"name\\\":\\\"${orgName}\\\",\\\"displayName\\\":null}\"`
    )
  })
})
