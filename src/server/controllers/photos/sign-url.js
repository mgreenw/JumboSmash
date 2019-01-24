// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');
const serverUtils = require('../../utils');

const NODE_ENV = serverUtils.getNodeEnv();

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

/**
 * @api {get} /api/photos/sign-url
 *
 */
const signURL = async (req: $Request, res: $Response) => {
  // Get the old unconfirmed uuid, if it exists. If it does not exist,
  // insert the new one.
  const result = await db.query(`
      INSERT INTO unconfirmed_photos
      (user_id, uuid)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET uuid = unconfirmed_photos.uuid
      RETURNING uuid
    `, [req.user.id, uuidv4()]);

  // Check if the user has already requested a url. If so, resign the url
  // for that uuid. Else, get a new UUID.
  const { uuid } = result.rows[0];

  const params = {
    Bucket: bucket,
    Fields: {
      key: `photos/${NODE_ENV}/${uuid}`,
    },
    Expires: 600,
    Conditions: [
      { acl: 'authenticated-read' },
      { 'Content-Type': 'image/jpeg' },
      ['content-length-range', 1, 500000], // 0.5 Mb
    ],
  };

  // Get a signed url for the given photo uuid.
  s3.createPresignedPost(params, (err, data) => {
    if (err) return utils.error.server(res, `S3 Error: ${err}`);

    // Add acl to payload
    const payload = data;
    payload.fields.acl = 'authenticated-read';

    // Return success!
    return res.status(200).json({
      status: codes.SIGN_URL__SUCCESS,
      payload,
    });
  });
};

module.exports = signURL;
