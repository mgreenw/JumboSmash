// development.js

const secrets = require('../secrets');

module.exports = {
  // secrets.get('sendgrid_api_key'),
  DOCKER_USERNAME: 'sperrys',
  DOCKER_PASSWORD: secrets.get('DOCKER_PASSWORD'),
};
