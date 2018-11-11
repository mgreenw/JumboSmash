// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');

const apiUtils = require('../utils');
const utils = require('./utils');
const codes = require('../status-codes');
const db = require('../../db');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "wantsHe": {
      "description": "The user's interest in he series.",
      "type": "boolean"
    },
    "wantsShe": {
      "description": "The user's interest in she series.",
      "type": "boolean"
    },
    "wantsThey": {
      "description": "The user's interest in they series.",
      "type": "boolean"
    },
    "usesHe": {
      "description": "The user identifies as he series.",
      "type": "boolean"
    },
    "usesShe": {
      "description": "The user identifies as she series.",
      "type": "boolean"
    },
    "usesThey": {
      "description": "The user identifies as they series.",
      "type": "boolean"
    },
  },
  "required": []
};
/* eslint-enable */

/**
 * @api {patch} /api/users/me/settings
 *
 */
const updateMySettings = async (req: $Request, res: $Response) => {
// Get all fields from the request body. If the value is not in the request,
  // it will be undefined. The key in this object is the name of the postgres
  // field that relates to this value
  const allFields = {
    wants_he: req.body.wantsHe,
    wants_she: req.body.wantsShe,
    wants_they: req.body.wantsThey,
    uses_he: req.body.usesHe,
    uses_she: req.body.usesShe,
    uses_they: req.body.usesThey,
  };

  // Remove all undefined values. Switch the object to an array of pairs
  // for a consistant ordering
  const definedFields = _.toPairs(_.omitBy(allFields, _.isUndefined));

  // If there is nothing to update, success!
  if (definedFields.length === 0) {
    return res.status(201).json({
      status: codes.UPDATE_SETTINGS__SUCCESS,
    });
  }

  // Get an object of the template strings and fields
  const fieldTemplate = utils.getFieldTemplates(definedFields);

  try {
    // Update the settings in the database. Utilize fieldTemplates and the field
    // length as the parameter templates. It is ok to construct the string like
    // this because none of the values in the construction come from user input
    await db.query(`
      UPDATE users
      SET ${fieldTemplate.templateString}
      WHERE id = $${fieldTemplate.fields.length + 1}`,
    [...fieldTemplate.fields, req.user.id]);

    // If there is an id returned, success!
    return res.status(201).json({
      status: codes.UPDATE_SETTINGS__SUCCESS,
    });
  } catch (error) {
    return apiUtils.error.server(res, 'Failed to update user settings.');
  }
};

module.exports = [apiUtils.validate(schema), updateMySettings];
