// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');

const db = require('../../db');
const apiUtils = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');

/**
 * @api {get} /api/relationships/matches
 *
 */
const getMatches = async (req: $Request, res: $Response) => {
  return apiUtils.error.server(res, 'Not implemented');
};

module.exports = getMatches;
