// @flow

import type { $Request, $Response } from 'express';

const db = require('../db');
const ldap = require('./utils/ldap');
const utils = require('./utils');
const codes = require('./status-codes');

// The values to select from the database
const memberSelect = `
  utln,
  exists,
  email,
  college,
  trunk_id AS "trunkId",
  class_year as "classYear",
  given_name as "givenName",
  last_name as "lastName",
  display_name as "displayName",
  major
`;

/**
 * @api {get} /api/member-info/:utln
 *
 */
const getUserInfo = async (req: $Request, res: $Response) => {
  const utln = req.params.utln.toLowerCase();

  // First, check to see if the member is already in the database
  try {
    const result = await db.query(`
      SELECT ${memberSelect}
      FROM members
      WHERE utln = $1
      `, [utln]);

    // Check if the db query returned any results
    if (result.rowCount > 0) {
      const member = result.rows[0];

      // If the member exists, return the memmber
      if (member.exists) {
        return res.status(200).json({
          status: codes.GET_MEMBER_INFO__SUCCESS,
          member,
        });
      }

      // If the member does not exist (but has been stored in the database),
      // return NOT FOUND
      return res.status(404).json({
        status: codes.GET_MEMBER_INFO__NOT_FOUND,
      });
    }
  } catch (err) {
    return utils.error.server(res, err, 'Error looking up member in database.');
  }

  // If the user is not in the database, search ldap for the user
  const attributes = [
    'givenName',
    'mail',
    'tuftsEduCollege',
    'uid',
    'tuftsEduTrunk',
    'tuftsEduClassYear',
    'sn',
    'displayName',
    'tuftsEduMajor',
  ];

  try {
    // If ldap does not have a result, return "NOT FOUND"
    const searchResult = await ldap.search(`uid=${utln}`, attributes);
    if (searchResult.entries.length === 0) {
      await db.query(`
        INSERT INTO MEMBERS
        (utln, exists)
        VALUES ($1, false)
      `, [utln]);

      return res.status(404).json({
        status: codes.GET_MEMBER_INFO__NOT_FOUND,
      });
    }

    // Get and clean the member!
    const member = searchResult.entries[0];

    switch (member.tuftsEduCollege) {
      case 'COLLEGE OF LIBERAL ARTS':
        member.tuftsEduCollege = 'A&S';
        break;
      case 'SCHOOL OF ENGINEERING':
        member.tuftsEduCollege = 'E';
        break;
      default:
        break;
    }

    // Insert the member and respond with the member info
    const insertResult = await db.query(`
      INSERT INTO MEMBERS
      (utln, exists, email, given_name, college, trunk_id, class_year, last_name, display_name, major)
      VALUES ($1, true, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING ${memberSelect}
    `, [member.uid, member.mail, member.givenName, member.tuftsEduCollege, member.tuftsEduTrunk, member.tuftsEduClassYear, member.sn, member.displayName, member.tuftsEduMajor]);

    // Return the new member
    return res.status(200).json({
      status: codes.GET_MEMBER_INFO__SUCCESS,
      member: insertResult.rows[0],
    });
  } catch (err) {
    return utils.error.server(res, err, 'Failed to get member over ldap.');
  }
};

module.exports = getUserInfo;
