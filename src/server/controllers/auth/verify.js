// @flow

import type { $Request, $Response } from 'express';

const db = require('../../db');


/**
 * @api {get} /api/auth/verify/:hash
 * Verify a user with their verification hash
 */
const verify = async (req: $Request, res: $Response) => {
  const { hash } = req.params;

  const result = await db.query(
    'UPDATE users SET verified = true WHERE verified = false AND verification_hash = $1 AND verification_expire_date > $2 RETURNING id',
    [hash, new Date()],
  );

  // Not verified - no rows were updated
  if (result.rows.length === 0) {
    return res.redirect('/not-verified');
  }

  // Success! Verified
  return res.redirect('/verified');
};

module.exports = verify;
