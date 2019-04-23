// @flow

import type { $Request, $Response, $Next } from 'express';

const config = require('config');
const codes = require('../../status-codes');

// Get the launch date and convert it to a Javascript Date
// If no conversion can be made, throw! The process should not start if this
// date is not set.
const configLaunchDate = config.get('launch_date');
const launchDate = new Date(configLaunchDate);
if (Number.isNaN(launchDate.getTime())) {
  throw new Error(`Bad Launch Date: ${configLaunchDate}`);
}

// Middleware to check if the current date is after the launch date.
const isAfterLaunch = async (req: $Request, res: $Response, next: $Next) => {
  // If right now is after the launch date, finish.
  if (new Date() > launchDate) return next();

  // Otherwise, respond with the prelaunch wall message.
  return res.status(codes.PRELAUNCH_WALL_ACTIVE.code).json({
    status: codes.PRELAUNCH_WALL_ACTIVE.status,
    data: {
      launchDate,
    },
  });
};

module.exports = isAfterLaunch;
