// @flow

import type { $Request, $Response } from 'express';

const config = require('config');
const aws = require('aws-sdk');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');
const serverUtils = require('../../utils');

const NODE_ENV = serverUtils.getNodeEnv();

const s3 = new aws.S3({ region: 'us-east-2', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

const getSignedUrl = async (params) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

/**
 * @api {get} /api/photos/:photoId
 *
 */
const getPhoto = async (req: $Request, res: $Response) => {
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
        status: codes.GET_PHOTO__NOT_FOUND,
      });
    }

    const [{ uuid }] = photoRes.rows;
    const params = {
      Bucket: bucket,
      Key: `photos/${NODE_ENV}/${uuid}`,
    };

    const url = await getSignedUrl(params);
    return res.redirect(url);
  } catch (error) {
    return utils.error.server(res, 'Query failed');
  }
};

module.exports = getPhoto;
