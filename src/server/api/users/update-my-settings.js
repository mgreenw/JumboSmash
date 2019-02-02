// @flow

import type { $Request } from 'express';

const _ = require('lodash');

const apiUtils = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "wantPronouns": {
      "description": "The set of pronouns the user wants to match with in Smash",
      "type": "object",
      "properties": {
        "she": {
          "type": "boolean"
        },
        "he": {
           "type": "boolean"
        },
        "they": {
           "type": "boolean"
        }
      }
    },
    "usePronouns": {
      "description": "The set of pronouns the user uses",
      "type": "object",
      "properties": {
        "she": {
          "type": "boolean"
        },
        "he": {
           "type": "boolean"
        },
        "they": {
           "type": "boolean"
        }
      }
    }
  },
  "required": []
};
/* eslint-enable */

/**
 * @api {patch} /api/users/me/settings
 *
 */
const updateMySettings = async (userId: number, wantPronouns: Object, usePronouns: Object) => {
// Get all fields from the request body. If the value is not in the request,
  // it will be undefined. The key in this object is the name of the postgres
  // field that relates to this value
  const allFields = {
    want_he: wantPronouns.he,
    want_she: wantPronouns.she,
    want_they: wantPronouns.they,
    use_he: usePronouns.he,
    use_she: usePronouns.she,
    use_they: usePronouns.they,
  };

  // Remove all undefined values. Switch the object to an array of pairs
  // for a consistant ordering
  const definedFields = _.toPairs(_.omitBy(allFields, _.isUndefined));

  // If there is nothing to update, success!
  if (definedFields.length === 0) {
    return apiUtils.status(codes.UPDATE_SETTINGS__SUCCESS).data({});
  }

  // Get an object of the template strings and fields
  const fieldTemplate = utils.getFieldTemplates(definedFields);

  // Update the settings in the database. Utilize fieldTemplates and the field
  // length as the parameter templates. It is ok to construct the string like
  // this because none of the values in the construction come from user input
  await db.query(`
    UPDATE users
    SET ${fieldTemplate.templateString}
    WHERE id = $${fieldTemplate.fields.length + 1}`,
  [...fieldTemplate.fields, userId]);

  // If there is an id returned, success!
  return apiUtils.status(codes.UPDATE_SETTINGS__SUCCESS).data({});
};

const handler = [
  apiUtils.validate(schema),
  apiUtils.asyncHandler(async (req: $Request) => {
    return updateMySettings(req.user.id, req.body.wantPronouns || {}, req.body.usePronouns || {});
  }),
];

module.exports = {
  handler,
  apply: updateMySettings,
};
