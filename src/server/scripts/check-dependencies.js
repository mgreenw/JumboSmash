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
/* eslint-disable no-await-in-loop */

const { exec } = require('child_process');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

function checkDependencies(environments = ['prod']) {
  return new Promise((resolve, reject) => {
    environments.map(env => `--${env}`);
    const envOptions = environments.join(' ');
    exec(`npm ls --depth 0 ${envOptions} --json`, (_, stdout) => {
      // Get the response as a JS object
      const dependencies = JSON.parse(stdout);

      // If there are problems, print them out and reject.
      if ('problems' in dependencies) {
        console.log('✗ There are problems with your dependencies.');
        dependencies.problems.forEach((problem, index) => {
          console.log(`${index + 1}) ${problem}`);
        });
        console.log('\nTry running "npm install" in src/server.');
        reject();
      }

      // If there are no problems, resolve!
      resolve();
    });
  });
}

// Define which environments need
const envDeps = {
  production: ['prod'],
  staging: ['prod'],
  development: ['prod', 'dev'],
  test: ['prod', 'dev'],
  travis: ['prod', 'dev'],
};

// Main function!
async function main() {
  // Ensure the environment is valid

  if (!(NODE_ENV in envDeps)) {
    console.log(`✗ Invalid environment: ${NODE_ENV}.`);
    console.log(`Options: ${Object.keys(envDeps)}`);
    process.exit(1);
  }

  // Get the dependencies to check for the given enviorment
  try {
    const deps = envDeps[NODE_ENV];
    console.log(`Checking ${NODE_ENV} dependencies…`);

    // Check all the specificed dependencies!
    await checkDependencies(deps);

    // If no error was throw, exit with status 0
    console.log('\n✓ Dependencies up to date.');
    process.exit(0);
  } catch (error) {
    // Given an error was throw, exit with status 1
    process.exit(1);
  }
}

// This check is a little slow, so lets print out some elephants
// to show our progress.
setInterval(() => {
  process.stdout.write('🐘');
}, 250);

// Because main is async, we need to define it as a function
// and then run it here.
main();
