// secrets.js
const fs = require('fs');

// logger commented out because of recursive config call

function get(secret) {
  try {
    // docker secret are accessible within tmpfs /run/secrets dir
    // https://docs.docker.com/engine/swarm/secrets/#how-docker-manages-secrets
    return fs.readFileSync(`/run/secrets/${secret}`, 'utf8').trim();
  } catch (error) {
    throw new Error(`Failed to get secret ${secret}`);
  }
}

module.exports = {
  get,
};
