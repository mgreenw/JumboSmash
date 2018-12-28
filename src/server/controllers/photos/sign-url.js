// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');

const bucket = config.get('s3_bucket');

/**
 * @api {get} /api/photos/sign-url
 *
 */
const signURL = async (req: $Request, res: $Response) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const s3Params = {
    Bucket: bucket,
    Key: fileName,
    Expires: 600,
    ACL: 'authenticated-read',
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      return utils.error.server(res, 'S3 Error.');
    }

    const returnData = {
      signedRequest: data,
      url: `https://${bucket}.s3.amazonaws.com/${fileName}`,
    };

    return res.status(200).json(returnData);
  });
};

module.exports = signURL;
