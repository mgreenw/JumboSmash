// @flow

const Sentry = require('@sentry/node');
const config = require('config');
const migrate = require('node-pg-migrate');
const logger = require('./logger');

async function runMigrations(options: { dryRun: boolean } = { dryRun: true }): Promise<string[]> {
  const migrations: { name: string, path: string, timestamp: number }[] = await migrate({
    databaseUrl: config.get('db'),
    dir: './db/migrations',
    migrationsTable: 'pgmigrations',
    direction: 'up',
    dryRun: options.dryRun,
    log: () => {}, // This ensures the migration output does not go to stdout
  });

  return migrations.map(({ name }) => name);
}

// 10 seconds for the other server to stop and 5 seconds of buffer for docker. And then we pray.
const msWaitBeforeMigrate = 15000;
let startupComplete = false;

// Run the startup function as soon as possible.
const startup = (async () => {
  try {
    // Check if there are migrations pending. If there are, return ASAP.
    // If this fails it will throw an error.
    const pendingMigrations = await runMigrations({ dryRun: true });
    if (pendingMigrations.length === 0) {
      logger.debug('No migrations to run.');
      startupComplete = true;
      return;
    }

    logger.info(`Migrations to run:\n${pendingMigrations.join('\n')}`);
    // Wait for msWaitBeforeMigrate to allow all clients to disconnect
    await new Promise(resolve => setTimeout(resolve, msWaitBeforeMigrate));

    // Run the real migrations. If this fails it will throw an error.
    const migrations = await runMigrations({ dryRun: false });
    logger.info(`Migrations complete:\n${migrations.join('\n')}\n\nServer up.`, {
      migrations,
    });
    startupComplete = true;
  } catch (error) {
    Sentry.captureException(error);
    process.exit(1);
  }
})();

module.exports = {
  startupComplete,
  startup,
};
