// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const db = require('../../db');
const apiUtils = require('../utils');
const codes = require('../status-codes');

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
const reorderPhotos = async (newOrder: number[], userId: number, userHasProfile: boolean) => {
  // No worry about SQL Injection here: newOrder is verified to be an
  // array of integers/numbers.
  const result = await db.query(`
    SELECT COUNT(*) AS "mismatchCount"
    FROM UNNEST(ARRAY[${newOrder.join(',')}]) photo_id
    FULL JOIN (SELECT id FROM photos WHERE user_id = $1) photos on photos.id=photo_id
    WHERE
          photo_id IS NULL
      OR photos.id IS NULL
  `, [userId]);

  const [{ mismatchCount }] = result.rows;

  // If there are photo id mismatches, error
  if (mismatchCount > 0) {
    return apiUtils.status(400).json({
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
  if (userHasProfile) {
    await db.query(`
      UPDATE profiles
      SET splash_photo_id = $1
      WHERE user_id = $2
    `, [newOrder[0], userId]);
  }

  return apiUtils.status(200).json({
    status: codes.REORDER_PHOTOS__SUCCESS,
    photos: newOrder,
  });
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return reorderPhotos(req.body, req.user.id, req.user.hasProfile);
  }),
];

module.exports = {
  handler,
  apply: reorderPhotos,
};
