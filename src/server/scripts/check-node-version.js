/*
 *  check-node-verson.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure the Node version being used is consistent with the Node version
 *  required in the package.json
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
