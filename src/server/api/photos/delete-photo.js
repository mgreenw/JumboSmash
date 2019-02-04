// @flow

import type { $Request } from 'express';

const config = require('config');
const aws = require('aws-sdk');
const _ = require('lodash');

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
  // On error, return a server error.
  const photosRes = await db.query(`
    SELECT id, uuid, index
    FROM photos
    WHERE user_id = $1
    ORDER BY index
  `, [userId]);

  // First, ensure the photo exists in this list.
  // Remove the photo that we want to delete from the photos
  const photos = photosRes.rows;
  const [photoToDelete] = _.remove(photos, photo => photo.id === photoId);
  if (photoToDelete === undefined) {
    return apiUtils.status(codes.DELETE_PHOTO__NOT_FOUND).noData();
  }

  // Transaction to delete the photo:
  const client = await db.connect();
  try {
    // 0. Begin the transaction
    await client.query('BEGIN');

    // 1. Remove the photo from our database
    await client.query(`
      DELETE FROM photos
      WHERE
        id = $1
    `, [photoToDelete.id]);

    // Get an updated list of photos for the requesting user
    const updatedPhotos = _.map(photos, (photo, index) => {
      return `(${photo.id}, ${index + 1})`;
    });

    // 2. Update the photos for the requesting user. Only do if some photos exist
    if (photos.length > 0) {
      await client.query(`
        UPDATE photos
        SET index = updated_photos.index
        FROM
          (VALUES
            ${updatedPhotos.join(',')}
          ) AS updated_photos (id, index)
        WHERE photos.id = updated_photos.id
      `);
    }

    // 3. Delete the photo from S3
    const params = {
      Bucket: bucket,
      Key: `photos/${NODE_ENV}/${photoToDelete.uuid}`,
    };
    await s3.deleteObject(params).promise();

    // 4. Commit the transaction!
    await client.query('COMMIT');

    return apiUtils.status(codes.DELETE_PHOTO__SUCCESS).data(
      _.map(photos, photo => photo.id),
    );
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
