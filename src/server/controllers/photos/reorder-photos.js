// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');

const s3 = new aws.S3({ region: 'us-east-2', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

/**
 * @api {patch} /api/photos/reorder
 *
 */
const reorderPhotos = async (req: $Request, res: $Response) => {
  // On error, return a server error.
  const { photoId } = req.params;
  try {
    const photoRes = await db.query(`
      SELECT uuid
      FROM photos
      WHERE id = $1
    `, [photoId]);
    if (photoRes.rowCount === 0) {
      return res.status(400).json({
        status: 'GET_PHOTO__NOT_FOUND',
      });
    }

    const [{ uuid }] = photoRes.rows;
    const params = {
      Bucket: bucket,
      Key: `photos/${uuid}`,
    };

    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        return utils.error.server(res, 'Failed to get photo url.');
      }
      return res.redirect(url);
    });
  } catch (error) {
    return utils.error.server(res, 'Query failed');
  }
};

module.exports = reorderPhotos;
