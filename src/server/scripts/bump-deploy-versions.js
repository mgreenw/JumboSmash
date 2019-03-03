/*
 *  bump-deploy-versions.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Bump the staging.yml and prod.yml files to match the current server version!
 *
 */

/* eslint-disable no-console */
/* eslint-disable-next-line */
const yaml = require('js-yaml');
const fs = require('fs');
const semver = require('semver');
const { exec } = require('child_process');
const config = require('config');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

const stagingFilePath = '../deploy/staging.yml';

// Main function!
(async () => {
  const newVersion = semver.parse(process.argv[2]);
  if (!newVersion) {
    console.log(`Invalid version ${process.argv[2]}`)
    process.exit(1);
  }
  const staging = yaml.safeLoad(fs.readFileSync(stagingFilePath, 'utf8'));
  const oldVersion = semver.parse(staging.services.server.image.split(':')[1]);
  if (!semver.gt(newVersion, oldVersion)) {
    console.log(`The new server version must be higher than the old version ${oldVersion.toString()}`);
    process.exit(1);
  }

  staging.services.server.image = `maxgreenwald/projectgem:${newVersion.toString()}`;

  const newStaging = yaml.safeDump(staging, {
    noArrayIndent: true,
  });
  fs.writeFileSync(stagingFilePath, newStaging, 'utf8');

  console.log('Done!');
})();
