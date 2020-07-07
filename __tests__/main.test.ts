import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_SERVER_URL'] = 'https://api.mackerelio.com'
  process.env['INPUT_VERSION'] = 'v0'
  process.env['INPUT_PATH'] = 'org'
  process.env['INPUT_HTTP_METHOD'] = 'GET'
  process.env['INPUT_API_KEY'] = process.env.TEST_API_KEY
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecSyncOptions = {
    env: process.env
  }

  const orgName = process.env.TEST_ORG_NAME
  expect(cp.execSync(`node ${ip}`, options).toString()).toEqual(
    `::set-output name=response::{"name":"${orgName}"}\n`
  )
})
