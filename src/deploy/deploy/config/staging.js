// production.js

const secrets = require('../secrets');

module.exports = {
  DOCKER_USERNAME: 'sperrys',
  DOCKER_PASSWORD: secrets.get('DOCKER_PASSWORD'),
};
