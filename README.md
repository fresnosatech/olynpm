[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Olynpm - keep your project npm dependencies up-to-date

Olynpm is the open source companion to keep your project npm dependencies up-to-date. Hassle free. Easy to setup.

## Install

```bash
npx olynpm
```

## Usage

```bash
Usage: olynpm [options] [command]

Fitness App for your npm projects.

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  audit           Create an audit report for your project dependencies*.
  report-url      Create a link to the report based on project dependencies
  help [command]  display help for command

```

## Setup report analytics.

1. Setup your account: https://olynpm.fresnosa.tech/setup

2. Kick-off Olynpm companion.

Run the following command on the root folder of your project where the package.json file is located.

```bash
  npx olynpm audit

```

This functionality requires an account from https://olynpm.fresnosa.tech/ and an API Token.

WARNING: Olynpm reads information related to the dependencies used in your package.json and send that information together with the project name to a https://olynpm.fresnosa.tech/ in order to function properly.

DISCLAIMER: By using this CLI you agree to the following Terms of Service: https://olynpm.fresnosa.tech/tos

### Setup a Github workflow:

You can create a daily report for your project using a Github Workflow following this simple steps:

1. In your repository, create the .github/workflows/ directory to store your workflow files if doesn't exist.
2. In the.github/workflows/directory create a new file called olynpm-metrics.yml and add the following code.

```yaml
name: olynpm-metrics
run-name: Update Olynpm metrics
on:
  schedule:
    - cron: "15 15 * * 0"
jobs:
  olynpm-track-dependencies:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - env:
          OLYNPM_ACCESS_TOKEN: ${{ secrets.OLYNPM_ACCESS_TOKEN }}
        run: |
          npx olynpm audit
```

3. Update the cron schedule according to your project needs.
4. Commit these changes and push them to your GitHub repository.
5. Create a github action secret with the name "OLYNPM_ACCESS_TOKEN" for your repository using your access token.

## Create a one time activity report.

Run the following command on the root folder of your project where the package.json file is located.

```bash
 olynpm report-url
```
