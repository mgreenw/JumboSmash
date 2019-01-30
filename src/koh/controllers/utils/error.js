// @flow

import type { $Response } from 'express';

const codes = require('../status-codes');

exports.server = (res: $Response, err: Error, message: string) => {
  console.log(`${message}\n${err.toString()}`);
  return res.status(500).json(
    {
      status: codes.SERVER_ERROR,
    },
  );
};
