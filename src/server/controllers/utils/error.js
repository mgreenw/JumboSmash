// @flow

import type { $Response } from 'express';
const codes = require('../status-codes');

exports.server = (res: $Response, message: string) => {
  return res.status(500).json(
    {
      status: codes.SERVER_ERROR,
      message,
    }
  );
};
