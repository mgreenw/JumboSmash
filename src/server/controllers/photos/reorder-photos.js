// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');

const db = require('../../db');
const utils = require('../utils');
const codes = require('../status-codes');
const apiUtils = require('../utils');

/* eslint-disable */
const schema = {
  "type": "array",
  "minItems": 2,
  "maxItems": 4,
  "items": {
    "type": "number",
    "uniqueItems": true,
    "multipleOf": 1
  }
};
/* eslint-enable */

/**
 * @api {patch} /api/photos/reorder
 *
 */
const reorderPhotos = async (req: $Request, res: $Response) => {
  const newOrder = req.body;
  // No worry about SQL Injection here: newOrder is verified to be an
  // array of integers/numbers.
  try {
    const result = await db.query(`
      SELECT COUNT(*) AS "mismatchCount"
      FROM UNNEST(ARRAY[${newOrder.join(',')}]) photo_id
      FULL JOIN (SELECT id FROM photos WHERE user_id = $1) photos on photos.id=photo_id
      WHERE
           photo_id IS NULL
        OR photos.id IS NULL
    `, [req.user.id]);

    const [{ mismatchCount }] = result.rows;

    // If there are photo id mismatches, error
    if (mismatchCount > 0) {
      return res.status(400).json({
        status: codes.REORDER_PHOTOS__MISMATCHED_IDS,
      });
    }

    // Get an updated list of photos for the requesting user
    const updatedPhotos = _.map(newOrder, (photoId, index) => {
      return `(${photoId}, ${index + 1})`;
    });

    // 2. Update the photos for the requesting user
    await db.query(`
      UPDATE photos
      SET index = updated_photos.index
      FROM
        (VALUES
          ${updatedPhotos.join(',')}
        ) AS updated_photos (id, index)
      WHERE photos.id = updated_photos.id
    `);

    // If the user has a profile, set the new first photo to be the splash photo
    if (req.user.profileUserId !== null) {
      await db.query(`
        UPDATE profiles
        SET splash_photo_id = $1
        WHERE user_id = $2
      `, [newOrder[0], req.user.id]);
    }

    return res.status(200).json({
      status: codes.REORDER_PHOTOS__SUCCESS,
      photos: newOrder,
    });
  } catch (err) {
    return utils.error.server(res, err, 'Failed to reorder user photos');
  }
};

module.exports = [apiUtils.validate(schema), reorderPhotos];
