// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/photos/confirm-upload
 *
 */
const confirmUpload = async (req: $Request, res: $Response) => {
  // On error, return a server error.
  return utils.error.server(res, 'Failed to confirm upload.');
};

module.exports = confirmUpload;
