// @flow

import type { $Request, $Response } from 'express';

const _ = require('lodash');

const ldap = require('./utils/ldap');

const utils = require('./utils');
const codes = require('./status-codes');

/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {},
  "required": []
};
/* eslint-enable */

/**
 * @api {get} /api/user-info/:utln
 *
 */
const getUserInfo = async (req: $Request, res: $Response) => {

  const { utln } = req.params

  const attributes = ['givenName', 'mail', 'tuftsEduCollege', 'uid', 'tuftsEduTrunk', 'tuftsEduClassYear', 'sn', 'cn', 'displayName', 'tuftsEduMajor'];

  try {
    const result = await ldap.search(`uid=${utln}`, attributes);
    if (result.entries.length === 0) {
      console.log('No results for utln');
    } else {
      const user = result.entries[0];
      console.log('User found!');
      console.log(user);
    }
  } catch (error) {
    console.log(error);
  }

  // First, check if the user's info is already stored. If it is, then respond
  // with the user's info. Otherwise, use the ldap to look up the user info.

  // Ensure the user's year is 2019.
  // TODO: offload this to a local database instead of a Tufts server
  // const classYear = fields['Class Year'];
  // if (classYear !== '19') {
  //   return res.status(400).json({
  //     status: 'UTLN_NOT_2019',
  //     classYear,
  //   });
  // }

  // // Regex for the user's email from the White Pages.
  // const email = fields['Email Address'].match(new RegExp('<a href="mailto:' + "(.*)" + '">'))[1].trim();
  // console.log(fields);
  return res.status(500).json({
    status: codes.SERVER_ERROR,
    message: 'Not implemented.',
  });
};

module.exports = [utils.validate(schema), getUserInfo];
