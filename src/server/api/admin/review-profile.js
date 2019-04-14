// @flow

import type { $Request } from 'express';

const { status, asyncHandler, validate } = require('../utils');
const codes = require('../status-codes');
const db = require('../../db');
const slack = require('../../slack');
const { classmateSelect } = require('./utils');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "canBeSwipedOn": {
      "type": "boolean"
    },
    "canBeActiveInScenes": {
      "type": "boolean"
    },
    "comment": {
      "type": ["string", "null"],
      "minLength": 5,
      "maxLength": 500,
    },
  },
  "required": ["canBeSwipedOn", "canBeActiveInScenes", "comment"]
};
/* eslint-enable */

/**
 * @api {post} /admin/classmates/:userId/review
 *
 */
const reviewProfile = async (
  adminUserId: number,
  adminUtln: string,
  userId: number,
  canBeSwipedOn: boolean,
  canBeActiveInScenes: boolean,
  comment: string | null,
) => {
  const isNegativeReview = !(canBeSwipedOn && canBeActiveInScenes);
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

  const review = {
    type: 'review',
    timestamp: new Date().toISOString(),
    data: {
      reviewer: {
        id: adminUserId,
        utln: adminUtln,
      },
      comment,
      canBeSwipedOn,
      canBeActiveInScenes,
    },
  };

  // Insert the review
  const updatedClassmateResult = await db.query(`
    UPDATE classmates
    SET
      profile_status = 'reviewed',
      can_be_swiped_on = $2,
      can_be_active_in_scenes = $3,
      review_log = review_log || jsonb_build_array($4::jsonb)
    WHERE id = $5
    RETURNING ${classmateSelect}
  `, [adminUserId, canBeSwipedOn, canBeActiveInScenes, review, userId]);

  // If the review is "negative", alert slack. There will be lots of positive rewiews
  // so we don't want to overload slack.
  if (isNegativeReview) {
    slack.postAdminUpdate(adminUserId, adminUtln, `
      Profile Reviewed\n\nUser: ${utln}\nReview: ${JSON.stringify(review, null, 2)}
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
      req.body.canBeSwipedOn,
      req.body.canBeActiveInScenes,
      req.body.comment,
    );
  }),
];

module.exports = {
  handler,
  apply: reviewProfile,
};
