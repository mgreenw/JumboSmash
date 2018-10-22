/*
 *  check-postgres.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Ensure postgres is installed and has the correct version
 *
 */

/* eslint-disable no-console */

const semver = require('semver');
const { exec } = require('child_process');
const config = require('config');
const { Pool } = require('pg');

const { engines } = require('../package.json');

function checkPostgresInstallation() {
  return new Promise((resolve, reject) => {
    exec('psql --version', (_, stdout) => {
      // Check that Postgres (and psql) are installed
      if (!stdout.includes('psql (PostgreSQL)')) {
        console.log('✗ Postgres (or psql) not installed.');
        return reject();
      }

      // Ensure that Postgres version can be parsed.
      const version = semver.coerce(stdout);
      if (!semver.valid(version)) {
        console.log('✗ Could not find Postgres version.');
        return reject();
      }

      // Check that the postgres version is in the correct range.
      if (!semver.satisfies(version, engines.postgres)) {
        console.log(`✗ Postgres version ${version} not in ${engines.postgres}. Check Postgres installation".`);
        return reject();
      }

      console.log(`✓ Using Postgres ${version}.`);
      return resolve();
    });
  });
}

function checkDatabaseConnection() {
  return new Promise((resolve, reject) => {
    // Get database pool
    const db = config.get('db');
    const pool = new Pool(db);

    // Check if db connection successful.
    pool.query('SELECT NOW()', (err) => {
      if (err) {
        console.log(`✗ Database connection to '${db.database}' failed. Check /config/${process.env.NODE_ENV}.json`);
        pool.end();
        return reject();
      }
      console.log('✓ Database connection successful.');
      pool.end();
      return resolve();
    });
  });
}

function checkMigrationsComplete() {
  return new Promise((resolve, reject) => {
    exec('npm run migrate up -- --dry-run', (_, stdout) => {
      // If there are no migrations to run, then we are all set.
      if (stdout.includes('No migrations to run!')) {
        console.log('✓ Migrations up to date.');
        return resolve();
      }

      // If there are migrations to run, check if the files are available.
      // If so, then we can run "npm run migrate up". Otherwise, we may
      // need to specify the migrations folder.
      if (!stdout.includes('Migrating files:\n')) {
        console.log('✗ Migrations failed: unable to find migration files.');
      } else {
        console.log('✗ Migrations not up to date. Run "npm run migrate up".');
      }

      return reject();
    });
  });
}

// Main function!
async function main() {
  try {
    // Perform database checks
    await checkPostgresInstallation();
    await checkDatabaseConnection();
    await checkMigrationsComplete();

    // If no error was throw, exit with status 0
    process.exit(0);
  } catch (error) {
    // Given an error was throw, exit with status 1
    process.exit(1);
  }
}

// Because main is async, we need to define it as a function
// and then run it here.
main();
