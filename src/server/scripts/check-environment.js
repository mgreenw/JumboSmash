/*
 *  check-environment.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure the runtime envioronment is properly configured.
 *
 */

/* eslint-disable no-console */

const { spawn } = require('child_process');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

function runCheck(checkScript) {
  return new Promise((resolve, reject) => {
    // An overcomplicated to run 'npm run SCRIPT_NAME --silent'
    // Useful to get the stdout and stderr as it comes
    const check = spawn('npm', ['run', ...checkScript, '--silent']);

    check.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });
    check.stderr.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    check.on('close', (code) => {
      if (code !== 0) {
        return reject();
      }
      return resolve();
    });
  });
}

async function main() {
  if (NODE_ENV === undefined) {
    console.log('✗ NODE_ENV is undefined');
    process.exit(1);
  }

  console.log(`Using NODE_ENV: ${NODE_ENV}`);

  try {
    await runCheck(['check-dependencies']);
    await runCheck(['check-node-version']);
    await runCheck(['check-database']);
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
}

main();
