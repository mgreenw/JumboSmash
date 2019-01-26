// @flow

import type { $Response } from 'express';

const logger = require('../../logger');
const codes = require('../status-codes');

exports.server = (res: $Response, err: Error, message: string) => {
  logger.error(`${message}\n${err.toString()}`);
  return res.status(500).json(
    {
      status: codes.SERVER_ERROR,
    },
  );
};
