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

function updateDeployFile(path, version) {
  const env = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  const oldVersion = semver.parse(env.services.server.image.split(':')[1]);
  if (!semver.gt(version, oldVersion)) {
    console.log(`The new server version ${version.toString()} for ${path} must be higher than the old version ${oldVersion.toString()}`);
    process.exit(1);
  }

  env.services.server.image = `maxgreenwald/projectgem:${version.toString()}`;

  const newEnvDeploy = yaml.safeDump(env, {
    noArrayIndent: true,
  });
  fs.writeFileSync(path, newEnvDeploy, 'utf8');
}

// Main function!
(async () => {
  const newVersion = semver.parse(process.argv[2]);
  const prerelease = semver.prerelease(newVersion);

  if (!newVersion) {
    console.log(`Invalid version ${process.argv[2]}`);
    process.exit(1);
  }

  updateDeployFile('../../deploy/staging.yml', newVersion);

  if (!prerelease) {
    updateDeployFile('../../deploy/production.yml', newVersion);
  }

  console.log('Done!');
})();
