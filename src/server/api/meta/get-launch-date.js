// @flow

const config = require('config');
const codes = require('../status-codes');
const apiUtils = require('../utils');

// Get the launch date. If this date is not valid, the `is-after-launch`
// middleware will cause the application to throw an error and exit.
const launchDate = new Date(config.get('launch_date'));

/**
 * @api {get} /api/meta/launch-date
 *
 */
const getLaunchDate = async () => {
  const now = new Date();
  return apiUtils.status(codes.GET_LAUNCH_DATE__SUCCESS).data({
    launchDate,
    currentDate: now,
    wallIsUp: now < launchDate,
  });
};

const handler = [
  apiUtils.asyncHandler(async () => {
    return getLaunchDate();
  }),
];

module.exports = {
  apply: getLaunchDate,
  handler,
};
