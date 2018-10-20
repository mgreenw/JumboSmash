/*
 *  check-dependencies.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure the dependencies of the server are up to date. Print errors to
 *  stdout, and exit with code 1 if errors, and 0 if no errors.
 *
 */

/* eslint-disable no-console */

const semver = require('semver');

const { engines } = require('../package.json');

// Get the current running node version
const version = process.versions.node;

// If the version is not in the correct range, print an error.
if (!semver.satisfies(version, engines.node)) {
  const minVersion = semver.coerce(engines.node).version;
  console.log(`✗ Node version ${version} not in ${engines.node}. Try running "nvm use ${minVersion}".`);
  process.exit(1);
}

// If the version is correct, log a success!
console.log(`✓ Using Node v${version}.`);
