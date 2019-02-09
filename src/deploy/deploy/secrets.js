// secrets.js
const fs = require('fs');
const util = require('util');

// logger commented out because of recursive config call

function get(secret) {
  // console.log("Getting Secret: " + secret);
  try {
    // docker secret are accessible within tmpfs /run/secrets dir
    // https://docs.docker.com/engine/swarm/secrets/#how-docker-manages-secrets
    const s = fs.readFileSync(util.format('/run/secrets/%s', secret), 'utf8').trim();
    // logger.info(secret);
    return s;
  } catch (e) {
    // logger.error(e);
    return false;
  }
}

module.exports = {
  get,
};
