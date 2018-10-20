/*
 *  check-environment.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure the dependencies of the server are up to date. Print errors to
 *  stdout, and exit with code 1 if errors, and 0 if no errors.
 *
 */

/* eslint-disable no-console */

const { exec } = require('child_process');

function runCheck(check) {
  return new Promise((resolve, reject) => {
    exec(check, (err, stdout) => {

      // Write the output to the console.
      process.stdout.write(stdout);

      // If there was an error, don't go on. Throw an error
      if (err) {
        return reject();
      }
      return resolve();
    });
  });
}

async function main() {
  if (process.env.NODE_ENV === undefined) {
    console.log('✗ NODE_ENV is undefined');
    process.exit(1);
  }

  console.log(`Using NODE_ENV: ${process.env.NODE_ENV}`);

  try {
    await runCheck('npm run check-node-version --silent');
    await runCheck('npm run check-database --silent');
    await runCheck('npm run check-dependencies --silent');
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

main();
