// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');
const uuid = require('uuid/v4');

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
  const photoUUID = uuid();

  const s3Params = {
    Bucket: bucket,
    Key: `uploads/${req.user.id}`,
    Expires: 600,
    ACL: 'bucket-owner-full-control',
    Metadata: {
      uuid: photoUUID,
    },
  };

  // 1. Confirm that we can actually upload an object
  s3.getSignedUrl('putObject', s3Params, async (err, data) => {
    if (err) {
      return utils.error.server(res, 'S3 Error.');
    }

    // 2. Invalidate any old upload.
    await db.query(`
      INSERT INTO unconfirmed_photos
      (user_id, uuid)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET uuid = $3
    `, [req.user.id, photoUUID, photoUUID]);

    return res.status(200).json({
      status: codes.SIGN_URL__SUCCESS,
      url: data,
    });
  });
};

module.exports = signURL;
