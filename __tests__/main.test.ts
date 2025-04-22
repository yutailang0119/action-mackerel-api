import fs from 'fs'
import * as process from 'process'
import * as cp from 'child_process'
import * as path from 'path'
import {expect, test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  const outputFile = path.join(__dirname, 'github_output')

  process.env['INPUT_SERVER-URL'] = 'https://api.mackerelio.com'
  process.env['INPUT_API-KEY'] = process.env.TEST_API_KEY
  process.env['INPUT_HTTP-METHOD'] = 'GET'
  process.env['INPUT_VERSION'] = 'v0'
  process.env['INPUT_PATH'] = 'org'
  process.env['INPUT_DRY-RUN'] = 'false'
  process.env['GITHUB_OUTPUT'] = outputFile
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }

  const orgName = process.env.TEST_ORG_NAME
  fs.writeFileSync(outputFile, '', {flag: 'wx'})

  cp.execFileSync(np, [ip], options)
  const output = fs.readFileSync(outputFile, 'utf-8')
  expect(output).toContain(
    `\"{\\\"name\\\":\\\"${orgName}\\\",\\\"displayName\\\":null}\"`
  )

  fs.unlinkSync(outputFile)
})
