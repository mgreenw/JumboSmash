// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const apiUtils = require('../utils');
const { settingsSelectQuery, getFieldTemplates } = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "lookingForGenders": {
      "description": "The set of pronouns the user wants to match with in Smash",
      "type": "object",
      "properties": {
        "woman": {
          "type": "boolean"
        },
        "man": {
           "type": "boolean"
        },
        "nonBinary": {
           "type": "boolean"
        }
      }
    },
    "identifyAsGenders": {
      "description": "The set of pronouns the user uses",
      "type": "object",
      "properties": {
        "woman": {
          "type": "boolean"
        },
        "man": {
           "type": "boolean"
        },
        "nonBinary": {
           "type": "boolean"
        }
      }
    },
    "activeScenes": {
      "description": "The scenes which the user is active in",
      "type": "object",
      "properties": {
        "smash": {
          "type": "boolean"
        },
        "social": {
           "type": "boolean"
        },
        "stone": {
           "type": "boolean"
        }
      }
    },
    "expoPushToken": {
      "description": "The push notification token from expo",
      "type": ["string", "null"]
    }
  },
  "required": []
};
/* eslint-enable */

/**
 * @api {patch} /api/users/me/settings
 *
 */
const updateMySettings = async (
  userId: number,
  lookingForGenders: Object,
  indentifyAsGenders: Object,
  activeScenes: Object,
  expoPushToken: ?string,
) => {
// Get all fields from the request body. If the value is not in the request,
  // it will be undefined. The key in this object is the name of the postgres
  // field that relates to this value
  const allFields = {
    want_he: lookingForGenders.man,
    want_she: lookingForGenders.woman,
    want_they: lookingForGenders.nonBinary,
    use_he: indentifyAsGenders.man,
    use_she: indentifyAsGenders.woman,
    use_they: indentifyAsGenders.nonBinary,
    active_smash: activeScenes.smash,
    active_social: activeScenes.social,
    active_stone: activeScenes.stone,
    expo_push_token: expoPushToken,
  };

  // Remove all undefined values. Switch the object to an array of pairs
  // for a consistant ordering
  const definedFields = _.toPairs(_.omitBy(allFields, _.isUndefined));

  // Result of SELECT or UPDATE query (will be the same either way)
  let result;

  // If there is nothing to update, just get the settings and return them
  if (definedFields.length === 0) {
    result = await db.query(`
      SELECT ${settingsSelectQuery()}
      FROM users
      WHERE id = $1
    `, [userId]);
  } else {
    // Get an object of the template strings and fields
    const fieldTemplate = getFieldTemplates(definedFields);

    // Update the settings in the database. Utilize fieldTemplates and the field
    // length as the parameter templates. It is ok to construct the string like
    // this because none of the values in the construction come from user input
    result = await db.query(`
      UPDATE users
      SET ${fieldTemplate.templateString}
      WHERE id = $${fieldTemplate.fields.length + 1}
      RETURNING ${settingsSelectQuery()}
    `, [...fieldTemplate.fields, userId]);
  }

  // If there is an id returned, success!
  return apiUtils.status(codes.UPDATE_SETTINGS__SUCCESS).data(result.rows[0]);
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return updateMySettings(
      req.user.id,
      req.body.lookingForGenders || {},
      req.body.identifyAsGenders || {},
      req.body.activeScenes || {},
      req.body.expoPushToken,
    );
  }),
];

module.exports = {
  handler,
  apply: updateMySettings,
};
