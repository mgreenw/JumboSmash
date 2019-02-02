// @flow

import type { $Request } from 'express';

const config = require('config');
const aws = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');
const serverUtils = require('../../utils');

const NODE_ENV = serverUtils.getNodeEnv();

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

// We can't use promisify here because...it broke. Not sure why.
const createPresignedPost = (params) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(params, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

/**
 * @api {get} /api/photos/sign-url
 *
 */
const signURL = async (userId: number) => {
  // Get the old unconfirmed uuid, if it exists. If it does not exist,
  // insert the new one.
  const result = await db.query(`
      INSERT INTO unconfirmed_photos
      (user_id, uuid)
      VALUES ($1, $2)
      ON CONFLICT (user_id) DO UPDATE
      SET uuid = unconfirmed_photos.uuid
      RETURNING uuid
    `, [userId, uuidv4()]);

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
  const data = await createPresignedPost(params);

  // Add acl to payload
  const payload = data;
  payload.fields.acl = 'authenticated-read';

  // Return success!
  return apiUtils.status(codes.SIGN_URL__SUCCESS).data({
    payload,
  });
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return signURL(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: signURL,
};
