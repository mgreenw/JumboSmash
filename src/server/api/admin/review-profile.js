// @flow

import type { $Request } from 'express';

const { status, asyncHandler, validate } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const slack = require('../../slack');
const { classmateSelect } = require('./utils');
const { constructAccountUpdate } = require('../users/utils');
const { scenes } = require('../relationships/utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "updatedCapabilities": {
      "type": "object",
      "properties": {
        "canBeSwipedOn": {
          "type": "boolean"
        },
        "canBeActiveInScenes": {
          "type": "boolean"
        },
      },
      "required": ["canBeSwipedOn", "canBeActiveInScenes"]
    },
    "previousCapabilities": {
      "type": "object",
      "properties": {
        "canBeSwipedOn": {
          "type": "boolean"
        },
        "canBeActiveInScenes": {
          "type": "boolean"
        },
      },
      "required": ["canBeSwipedOn", "canBeActiveInScenes"]
    },
    "comment": {
      "type": ["string", "null"],
      "minLength": 5,
      "maxLength": 500,
    },
  },
  "required": ["updatedCapabilities", "previousCapabilities", "comment"]
};
/* eslint-enable */

export type Capabilities = {
  canBeSwipedOn: boolean,
  canBeActiveInScenes: boolean,
};

const activeScenesQuery = canBeActiveInScenes => scenes.map(scene => `active_${scene} = CASE WHEN ${canBeActiveInScenes} THEN active_${scene} ELSE false END`).join(',');


/**
 * @api {post} /admin/classmates/:userId/review
 *
 */
const reviewProfile = async (
  adminUserId: number,
  adminUtln: string,
  userId: number,
  updatedCapabilities: Capabilities,
  previousCapabilities: Capabilities,
  comment: string | null,
) => {
  const isNegativeReview = !(
    updatedCapabilities.canBeSwipedOn
    && updatedCapabilities.canBeActiveInScenes
  );
  // If can be swiped on or can be active in scenes is false, ensure there is a comment
  if (isNegativeReview) {
    if (!comment) {
      return status(codes.REVIEW_PROFILE__COMMENT_REQUIRED).noData();
    }
  }

  // Ensure the user id is valid and the user has a profile
  const userProfileResult = await db.query(`
    SELECT classmates.utln
    FROM classmates
    JOIN profiles ON profiles.user_id = classmates.id
    WHERE classmates.id = $1
  `, [userId]);

  if (userProfileResult.rowCount === 0) {
    return status(codes.REVIEW_PROFILE__NOT_FOUND).noData();
  }

  const [{ utln }] = userProfileResult.rows;

  // NOTE: A terminated user can be reviewed. This may be useful in "too young" terminations.
  // There is no negative impact here - reviewing a terminated user does not affect anything else.
  const review = constructAccountUpdate({
    type: 'PROFILE_REVIEW',
    reviewer: {
      id: adminUserId,
      utln: adminUtln,
    },
    comment,
    capabilities: updatedCapabilities,
  });

  // Insert the review
  const updatedClassmateResult = await db.query(`
    UPDATE classmates
    SET
      profile_status = 'reviewed',
      can_be_swiped_on = $2,
      can_be_active_in_scenes = $3,
      ${activeScenesQuery('$3')},
      account_updates = account_updates || jsonb_build_array($4::jsonb)
    WHERE id = $5 AND can_be_swiped_on = $6 AND can_be_active_in_scenes = $7
    RETURNING ${classmateSelect}
  `, [
    adminUserId,
    updatedCapabilities.canBeSwipedOn,
    updatedCapabilities.canBeActiveInScenes,
    review,
    userId,
    previousCapabilities.canBeSwipedOn,
    previousCapabilities.canBeActiveInScenes,
  ]);

  // If the query returned no data it means that the previous capabilites are out
  // of date. The admin should reload the user and try again.
  if (updatedClassmateResult.rowCount === 0) {
    return status(codes.REVIEW_PROFILE__INVALID_PREVIOUS_CAPABILITES).noData();
  }

  // If the review is "negative", alert slack. There will be lots of positive rewiews
  // so we don't want to overload slack.
  if (isNegativeReview) {
    slack.postAdminUpdate(adminUserId, adminUtln, `
      Profile Reviewed\n\nUser: ${utln}\nReview: ${'```'}${JSON.stringify(review, null, 2)}${'```'}
    `.trim());
  }

  // If "negative", alert slack.
  return status(codes.REVIEW_PROFILE__SUCCESS).data({
    classmate: updatedClassmateResult.rows[0],
  });
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return reviewProfile(
      req.user.id,
      req.user.utln,
      req.params.userId,
      req.body.updatedCapabilities,
      req.body.previousCapabilities,
      req.body.comment,
    );
  }),
];

module.exports = {
  handler,
  apply: reviewProfile,
};
