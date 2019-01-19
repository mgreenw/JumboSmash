// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');
const _ = require('lodash');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');
const serverUtils = require('../../utils');

const NODE_ENV = serverUtils.getNodeEnv();

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

/**
 * @api {delete} /api/photos/:photoId
 *
 */
const deletePhoto = async (req: $Request, res: $Response) => {
  // On error, return a server error.
  const photoId = Number.parseInt(req.params.photoId, 10);

  try {
    const photosRes = await db.query(`
      SELECT id, uuid, index
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [req.user.id]);

    // First, ensure the photo exists in this list.
    // Remove the photo that we want to delete from the photos
    const photos = photosRes.rows;
    const [photoToDelete] = _.remove(photos, photo => photo.id === photoId);
    if (photoToDelete === undefined) {
      return res.status(400).json({
        status: codes.DELETE_PHOTO__NOT_FOUND,
      });
    }

    if (photos.length === 0) {
      return res.status(400).json({
        status: codes.DELETE_PHOTO__CANNOT_DELETE_LAST_PHOTO,
      });
    }

    // Transaction to delete the photo:
    const client = await db.connect();
    try {
      // 0. Begin the transaction
      await client.query('BEGIN');

      // If we are deleting the splash photo, update the user's splash photo
      // Only do this if the user already has a profile
      if (req.user.profileUserId !== null && photoToDelete.index === 1) {
        await client.query(`
          UPDATE profiles
          SET splash_photo_id = $1
          WHERE user_id = $2
        `, [photos[0].id, req.user.id]);
      }

      // 1. Remove the photo from our database
      await client.query(`
        DELETE FROM photos
        WHERE id = $1
      `, [photoToDelete.id]);

      // Get an updated list of photos for the requesting user
      const updatedPhotos = _.map(photos, (photo, index) => {
        return `(${photo.id}, ${index + 1})`;
      });

      // 2. Update the photos for the requesting user
      await client.query(`
        UPDATE photos
        SET index = updated_photos.index
        FROM
          (VALUES
            ${updatedPhotos.join(',')}
          ) AS updated_photos (id, index)
        WHERE photos.id = updated_photos.id
      `);

      // 3. Delete the photo from S3
      const params = {
        Bucket: bucket,
        Key: `photos/${NODE_ENV}/${photoToDelete.uuid}`,
      };
      await s3.deleteObject(params).promise();

      // 4. Commit the transaction!
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      return utils.error.server(res, 'Failed to delete photo from database');
    }

    return res.status(200).json({
      status: codes.DELETE_PHOTO__SUCCESS,
    });
  } catch (error) {
    return utils.error.server(res, 'Query failed');
  }
};

module.exports = deletePhoto;
