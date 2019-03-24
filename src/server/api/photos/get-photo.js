// @flow

import type { $Request, $Response, $Next } from 'express';

const config = require('config');

const aws = require('../../aws');
const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');
const serverUtils = require('../../utils');

const NODE_ENV = serverUtils.getNodeEnv();

const s3 = new aws.S3({ region: 'us-east-1', signatureVersion: 'v4' });
const bucket = config.get('s3_bucket');

const getSignedUrl = async (params): Promise<string> => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
};

/**
 * @api {get} /api/photos/:photoUuid
 *
 */
const getPhoto = async (photoUuid: string) => {
  // Get the photo by uuid
  // NOTE: the join here ensures that the user is not banned.
  // This allows for blocked users to get the other user's photos.
  // This is ok because they will most likely already have them locally cached
  // so it is not a security risk.
  const photoRes = await db.query(`
    SELECT uuid
    FROM photos
    JOIN users ON photos.user_id = users.id
    WHERE photos.uuid = $1
  `, [photoUuid]);

  // If it does not exist, error.
  if (photoRes.rowCount === 0) {
    // Weird flowtype issue requires us to specifically define return type
    // Same bug as https://github.com/facebook/flow/issues/5294. Not resolve.
    // Should look into this more: Max made a trello ticket 2/4/19
    // $FlowFixMe
    return apiUtils.status(codes.GET_PHOTO__NOT_FOUND).noData();
  }

  // Sign a url for the photo and redirect the request to it
  const [{ uuid }] = photoRes.rows;
  const params = {
    Bucket: bucket,
    Key: `photos/${NODE_ENV}/${uuid}`,
  };

  const url = await getSignedUrl(params);
  return apiUtils.status(codes.GET_PHOTO__SUCCESS).data({
    url,
  });
};

const handler = [
  // We do NOT use the asyncMiddleware here because it uses res directly
  // to force a redirect.
  async (req: $Request, res: $Response, next: $Next) => {
    try {
      const photoRes = await getPhoto(req.params.photoUuid);

      // If the photo was succesfully retrieved, redirect to it!
      // NOTE: This is "abnormal" by the standards of the API
      if (photoRes.body.status === codes.GET_PHOTO__SUCCESS.status) {
        return res.redirect(photoRes.body.data.url);
      }

      // On failure, respond 'normally'
      return res.status(photoRes.statusCode).json(photoRes.body);
    } catch (err) {
      return next(err);
    }
  },
];

module.exports = {
  handler,
  apply: getPhoto,
};
