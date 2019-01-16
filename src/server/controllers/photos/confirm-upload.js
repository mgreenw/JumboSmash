// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');

const bucket = config.get('s3_bucket');

/**
 * @api {get} /api/photos/confirm-upload
 *
 */
const confirmUpload = async (req: $Request, res: $Response) => {
  // First, get the uuid of the unconfirmed photo. If it does not exist, fail
  try {
    const unconfirmedPhotoRes = await db.query(`
      SELECT uuid
      FROM unconfirmed_photos
      WHERE user_id = $1
      LIMIT 1
    `, [req.user.id]);

    if (unconfirmedPhotoRes.rowCount === 0) {
      return res.status(400).json({
        status: 'CONFIRM_UPLOAD__NO_UNCONFIRMED_PHOTO',
      });
    }

    const unconfirmedUUID = unconfirmedPhotoRes.rows[0].uuid;

    // Next, ensure the user only has 3 or fewer photos.
    // In this request, get the next index where a photo could go
    // If already 4 photos, fail
    const photosRes = await db.query(`
      SELECT COUNT(index) as "photoCount"
      FROM photos
      WHERE user_id = $1
    `, [req.user.id]);

    const { photoCount } = photosRes.rows[0];
    if (photoCount > 3) {
      return res.status(400).json({
        status: 'CONFIRM_UPLOAD__NO_AVAILABLE_SLOT',
      });
    }

    // Next, go to AWS and see if the photo actually exists in /uploads/:userId
    // and that the uuid there matches the local uuid.
    // If not, fail.

    const s3 = new aws.S3();

    const getObjectInfo = () => {
      return new Promise((resolve, reject) => {
        s3.headObject({
          Bucket: bucket,
          Key: `uploads/${req.user.id}`,
        }, (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    };

    try {
      const object = await getObjectInfo();
      if (object.Metadata.uuid !== unconfirmedUUID) {
        return res.status(400).json({
          status: 'CONFIRM_UPLOAD__UPLOADED_UUID_MISMATCH',
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: 'CONFIRM_UPLOAD__NO_UPLOAD_FOUND',
      });
    }

    // Move the photo in aws to /photos/:uuid
    // Delete the other version of the photo at /uploads/:userId
    // If this fails, server error
    const copyUpload = () => {
      return new Promise((resolve, reject) => {
        s3.copyObject({
          Bucket: bucket,
          CopySource: `/${bucket}/uploads/${req.user.id}`,
          Key: `photos/${unconfirmedUUID}`,
          ACL: 'authenticated-read',
        }, (err, data) => {
          if (err) return reject(err);
          return resolve(data);
        });
      });
    };

    try {
      await copyUpload();
    } catch (error) {
      return res.status(400).json({
        status: 'CONFIRM_UPLOAD__MOVE_PHOTO_FAILED',
      });
    }

    // Insert the photo in the `photos` table, giving it the "next" index.
    await db.query(`
      INSERT INTO photos
      (user_id, index, uuid)
      VALUES ($1, $2, $3)
      RETURNING id
    `, [req.user.id, photoCount + 1, unconfirmedUUID]);

    // Delete the unconfirmed photo
    await db.query(`
      DELETE FROM unconfirmed_photos
      WHERE uuid = $1
    `, [unconfirmedUUID]);

    return res.status(200).json({
      status: 'CONFIRM_UPLOAD__SUCCESS',
    });
  } catch (error) {
    console.log(error);
    return utils.error.server(res, 'Failed to confirm upload.');
  }
};

module.exports = confirmUpload;
