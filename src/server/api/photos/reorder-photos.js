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
    "type": "string",
    "format": "uuid"
  }
};
/* eslint-enable */

/**
 * @api {patch} /api/photos/reorder
 *
 */
const reorderPhotos = async (newOrder: string[], userId: number) => {
  // Generate the query paramaters.
  const newOrderParams = newOrder.map((uuid, index) => `$${index + 2}::uuid`);
  const result = await db.query(`
    SELECT COUNT(*) AS "mismatchCount"
    FROM UNNEST(ARRAY[${newOrderParams.join(',')}]) photo_uuid
    FULL JOIN (SELECT uuid FROM photos WHERE user_id = $1) photos on photos.uuid=photo_uuid
    WHERE
          photo_uuid IS NULL
      OR photos.uuid IS NULL
  `, [userId, ...newOrder]);

  const [{ mismatchCount }] = result.rows;

  // If there are photo uuid mismatches, error
  if (mismatchCount > 0) {
    return apiUtils.status(codes.REORDER_PHOTOS__MISMATCHED_UUIDS).noData();
  }

  // Get an updated list of photos for the requesting user
  const updatedPhotos = _.map(newOrder, (photoUuid, index) => {
    return `('${photoUuid}'::uuid, ${index + 1})`;
  });

  // 2. Update the photos for the requesting user
  await db.query(`
    UPDATE photos
    SET index = updated_photos.index
    FROM
      (VALUES
        ${updatedPhotos.join(',')}
      ) AS updated_photos (uuid, index)
    WHERE photos.uuid = updated_photos.uuid
  `);

  return apiUtils.status(codes.REORDER_PHOTOS__SUCCESS).data(newOrder);
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return reorderPhotos(req.body, req.user.id);
  }),
];

module.exports = {
  handler,
  apply: reorderPhotos,
};
