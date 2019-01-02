// secrets.js
const fs = require('fs');
const util = require('util');

module.exports = {
  // Get a secret from its name
  get(secret) {
    try {
      // docker secret are accessible within tmpfs /run/secrets dir
      // https://docs.docker.com/engine/swarm/secrets/#how-docker-manages-secrets
      return fs.readFileSync(util.format('/run/secrets/%s', secret), 'utf8').trim();
    } catch (e) {
      return false;
    }
  },
};
