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
 * @api {delete} /api/photos/:photoId
 *
 */
const deletePhoto = async (photoId: number, userId: number) => {
  // Transaction to delete the photo:
  const client = await db.connect();
  try {
    // 0. Begin the transaction
    await client.query('BEGIN');

    // 1. Remove the photo from our database
    const deleteResult = await db.query(`
      DELETE FROM photos
      WHERE id = $1 AND user_id = $2
      RETURNING uuid
    `, [photoId, userId]);

    if (deleteResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return apiUtils.status(codes.DELETE_PHOTO__NOT_FOUND).noData();
    }

    // 3. Delete the photo from S3
    const params = {
      Bucket: bucket,
      Key: `photos/${NODE_ENV}/${deleteResult.rows[0].uuid}`,
    };
    await s3.deleteObject(params).promise();

    const selectResult = await db.query(`
      SELECT
        ARRAY(
          SELECT id
          FROM photos
          WHERE user_id = $1
          ORDER BY index
        ) AS "photoIds"
    `, [userId]);

    // 4. Commit the transaction!
    await client.query('COMMIT');

    const [{ photoIds }] = selectResult.rows;

    return apiUtils.status(codes.DELETE_PHOTO__SUCCESS).data(photoIds);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

const handler = [
  apiUtils.asyncHandler(async (req: $Request) => {
    return deletePhoto(Number.parseInt(req.params.photoId, 10), req.user.id);
  }),
];

module.exports = {
  handler,
  apply: deletePhoto,
};
