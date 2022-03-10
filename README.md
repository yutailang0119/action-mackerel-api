<a href="https://github.com/yutailang0119/action-mackerel-api/actions"><img alt="action-mackerel-api status" src="https://github.com/yutailang0119/action-mackerel-api/workflows/build-test/badge.svg"></a>

# GitHub Action for Mackerel API

This action provides an interface for calling the [Mackerel API](https://mackerel.io/api-docs/) endpoint and getting the resulting JSON response.

## Features

Supports HTTP methods available in Mackerel API.

- [x] `GET`
- [ ] `POST`
    - [x] string format input
    - [ ] JSON format input
- [ ] `PUT`
    - [x] string format input
    - [ ] JSON format input
- [x] `DELETE`

## Example

- [.github/workflows/languages.yml](.github/workflows/languages.yml)
    - Post the lists languages for the repository ​​to Mackerel by using the [GitHub API](https://developer.github.com/v3/repos/#list-repository-languages).  

## Usage

An example workflow(.github/workflows/post-mackerel.yml) to executing action follows:

```yml
name: Post Mackerel

on:
  push:

jobs:
  post-mackerel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/github-script@v6
        id: create-body
        with:
          result-encoding: string
          script: |
            const time = Date.now() / 1000
            const body = [
              {
                name: 'Sample.foo',
                time: time,
                value: 30
              },
              {
                name: 'Sample.bar',
                time: time,
                value: 100
              }
            ]
            return JSON.stringify(body)
      - name: Post Mackerel
        uses: yutailang0119/action-mackerel-api@v3
        with:
          api-key: ${{ secrets.MACKEREL_API_KEY }}
          http-method: POST
          path: services/${{ secrets.MACKEREL_SERVICE_NAME }}/tsdb
          body: ${{ steps.create-body.outputs.result }}
```

## Author

[Yutaro Muta](https://github.com/yutailang0119)

## References

- Generated from [actions/typescript-action](https://github.com/actions/typescript-action) as template.

## License

action-mackerel-api is available under the MIT license. See [the LICENSE file](./LICENSE) for more info.
