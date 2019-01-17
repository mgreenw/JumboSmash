// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');
const _ = require('lodash');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');

const s3 = new aws.S3({ region: 'us-east-2', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

/**
 * @api {delete} /api/photos/:photoId
 *
 */
const deletePhoto = async (req: $Request, res: $Response) => {
  // On error, return a server error.
  const { photoId } = req.params;
  try {
    const photosRes = await db.query(`
      SELECT id, uuid, index
      FROM photos
      WHERE user_id = $1
      ORDER BY index
    `, [photoId, req.user.id]);

    // First, ensure the photo exists in this list.
    // Filter out the photo that we want to delete

    // NOTE FOR MAX: this is not ideal as it mutates photosRes.
    // Consider a different soln.
    const photos = _.remove(photosRes.rows, photo => photo.id === photoId);
    if (photos.length === 0) {
      return res.status(400).json({
        status: 'DELETE_PHOTO__NOT_FOUND',
      });
    }

    const [{ uuid }] = photoRes.rows;

    const params = {
      Bucket: bucket,
      Key: `photos/${uuid}`,
    };

    await s3.deleteObject('getObject', params).promise();
  } catch (error) {
    return utils.error.server(res, 'Query failed');
  }
};

module.exports = deletePhoto;
