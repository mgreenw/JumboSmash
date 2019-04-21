// @flow

const authenticated = require('./authenticated');
const hasProfile = require('./hasProfile');
const isAfterLaunch = require('./is-after-launch');
const isAdmin = require('./is-admin');

module.exports = {
  authenticated,
  hasProfile,
  isAfterLaunch,
  isAdmin,
};
