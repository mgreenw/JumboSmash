/*
 *  bump-deploy-versions.js
 *  Author: Max Greenwald
 *  Date: 10/20/18
 *
 *  Bump the staging.yml and prod.yml files to match the current koh version!
 *
 */

/* eslint-disable no-console */
const fs = require('fs');
const semver = require('semver');

const kohRegex = /kohthefacestealer\/koh:([0-9.]+(-beta.[0-9])*)/;

function updateDeployFile(path, version) {
  let env = fs.readFileSync(path, 'utf8');

  const oldVersion = semver.parse(env.match(kohRegex)[1]);
  if (!semver.gt(version, oldVersion)) {
    console.log(`The new koh version ${version.toString()} for ${path} must be higher than the old version ${oldVersion.toString()}`);
    process.exit(1);
  }

  env = env.replace(kohRegex, `kohthefacestealer/koh:${version.toString()}`);
  fs.writeFileSync(path, env, 'utf8');
}

console.log('Parsing new version from argument');
const newVersion = semver.parse(process.argv[2]);

console.log('Parsing prerelease');
const prerelease = semver.prerelease(newVersion);

if (!newVersion) {
  console.log(`Invalid version ${process.argv[2]}`);
  process.exit(1);
}

console.log('Updating staging.yml file');
updateDeployFile('../../deploy/staging.yml', newVersion);

if (!prerelease) {
  console.log('Updating production.yml file');
  updateDeployFile('../../deploy/production.yml', newVersion);
}

console.log('Done!');
