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

function checkDependencies(environment = 'prod') {
  return new Promise((resolve, reject) => {
    exec(`npm ls --depth 0 --${environment} --json`, (_, stdout) => {
      // Get the response as a JS object
      const dependencies = JSON.parse(stdout);

      // If there are problems, print them out and reject.
      if ('problems' in dependencies) {
        console.log(`✗ There are problems with your ${environment} dependencies.`);
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
};

// Main function!
async function main() {
  // Ensure the environment is valid
  const env = process.env.NODE_ENV;
  if (!(env in envDeps)) {
    console.log(`✗ Invalid environment ${env}.`);
    console.log(`Options: ${Object.keys(envDeps)}`);
    process.exit(1);
  }

  // Get the dependencies to check for the given enviorment
  const deps = envDeps[env];

  try {
    // Check all the specificed dependencies!
    for (let i = 0; i < deps.length; i += 1) {
      await checkDependencies(deps[i]);
    }

    // If no error was throw, exit with status 0
    console.log('✓ Dependencies up to date.');
    process.exit(0);
  } catch (error) {
    // Given an error was throw, exit with status 1
    process.exit(1);
  }
}

// Because main is async, we need to define it as a function
// and then run it here.
main();
