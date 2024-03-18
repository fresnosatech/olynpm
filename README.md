[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Olynpm - keep your project npm dependencies up-to-date

Olynpm is the open source companion to keep your project npm dependencies up-to-date. Hassle free. Easy to setup.

## Install

```bash
npm install olynpm -g
```

## Don't want to install?

That's alright, you can use Olynpm with npx:

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
  report-url      Create a link to the report based on project dependencies
  track           Track activity on project dependencies*.
  help [command]  display help for command

```

## Create a one time activity report (no progress tracking)

Run the following command on the root folder of your project where the package.json file is located.

```bash
 olynpm report-url
```

## Setup activity report.

1. Setup your account: https://olynpm.fresnosa.tech/setup

2. Kick-off Olynpm companion.

Run the following command on the root folder of your project where the package.json file is located.

```bash
  olynpm track

```

This functionality requires an account from https://olynpm.fresnosa.tech/ and an API Token.

WARNING: Olynpm reads information related to the dependencies used in your package.json and send that information together with the project name to a https://olynpm.fresnosa.tech/ in order to function properly.

DISCLAIMER: By using this CLI, you state that you have read and understood the terms and conditions: https://olynpm.fresnosa.tech/tos
