// @flow

import type { $Request } from 'express';

const config = require('config');
const aws = require('aws-sdk');

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');
const serverUtils = require('../../utils');

const NODE_ENV = serverUtils.getNodeEnv();

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

/**
 * @api {get} /api/photos/confirm-upload
 *
 */
const confirmUpload = async (userId: number) => {
  // First, get the uuid of the unconfirmed photo. If it does not exist, fail
  const unconfirmedPhotoRes = await db.query(`
    SELECT uuid
    FROM unconfirmed_photos
    WHERE user_id = $1
    LIMIT 1
  `, [userId]);

  if (unconfirmedPhotoRes.rowCount === 0) {
    return apiUtils.status(400).json({
      status: codes.CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO,
    });
  }

  const [{ uuid }] = unconfirmedPhotoRes.rows;

  // Next, go to AWS and see if the photo actually exists in /uploads/:userId
  // and that the uuid there matches the local uuid.
  // If not, fail.
  const s3Params = {
    Bucket: bucket,
    Key: `photos/${NODE_ENV}/${uuid}`,
  };

  try {
    await s3.headObject(s3Params).promise();
  } catch (error) {
    return apiUtils.status(400).json({
      status: codes.CONFIRM_UPLOAD__NO_UPLOAD_FOUND,
    });
  }

  // TRANSACTION: Insert the photo and delete its "unconfirmed" counterpart
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Ensure the user only has 3 or fewer photos.
    // In this request, get the next index where a photo could go
    // If already 4 photos, fail
    // NOTE: Typecast to SMALLINT is required here for node-postgres to return
    // it as an integer and not a string.
    const photosRes = await client.query(`
      SELECT COUNT(index)::SMALLINT as "photoCount"
      FROM photos
      WHERE user_id = $1
    `, [userId]);

    // Ensure there are only 3 or fewer photos
    const [{ photoCount }] = photosRes.rows;
    if (photoCount > 3) {
      return apiUtils.status(400).json({
        status: codes.CONFIRM_UPLOAD__NO_AVAILABLE_SLOT,
      });
    }

    // Insert the photo in the `photos` table, giving it the "next" index.
    const insertRes = await client.query(`
      INSERT INTO photos
      (user_id, index, uuid)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [userId, photoCount + 1, uuid]);

    const photoId = insertRes.rows[0].id;

    // Delete the unconfirmed photo
    await client.query(`
      DELETE FROM unconfirmed_photos
      WHERE uuid = $1
    `, [uuid]);

    // Commit the transaction and RELASE the client
    await client.query('COMMIT');
    client.release();

    return apiUtils.status(200).json({
      status: codes.CONFIRM_UPLOAD__SUCCESS,
      photoId,
    });
  } catch (err) {
    // Rollback the transaction and release the client
    await client.query('ROLLBACK');
    client.release();

    // Re-throw the error so it is caught by asyncHandler
    throw err;
  }
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return confirmUpload(req.user.id);
  }),
];

module.exports = {
  handler,
  apply: confirmUpload,
};
