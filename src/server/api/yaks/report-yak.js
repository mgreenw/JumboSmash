// @flow

import type { $Request } from 'express';

const slack = require('../../slack');
const { REPORT_YAK__SUCCESS, REPORT_YAK__YAK_NOT_FOUND } = require('../status-codes');
const db = require('../../db');
const { asyncHandler, status, validate } = require('../utils');


/* eslint-disable */
const schema = {
  "type": "object",
  "properties": {
    "message": {
      "type": "string",
      "description": "The message sent by the reporting user about the reported user"
    },
    "reasonCode": {
      "type": "string",
      "description": "The standardized reason for reporting the user",
      "maxLength": 100
    },
  },
  "required": ["message", "reasonCode"]
};
/* eslint-enable */

/**
 * @api {post} /api/yaks/:id/report
 *
 */
const reportYak = async (
  reportingUserId: number,
  yakId: number,
  message: string,
  reasonCode: string,
) => {
  // Ensure the yak exists
  const yakResult = await db.query('SELECT id FROM yaks WHERE id = $1', [yakId]);
  if (yakResult.rowCount === 0) {
    return status(REPORT_YAK__YAK_NOT_FOUND).noData();
  }

  await slack.postYakReport(reportingUserId, yakId, message, reasonCode);
  return status(REPORT_YAK__SUCCESS).noData();
};

const handler = [
  validate(schema),
  asyncHandler(async (req: $Request) => {
    return reportYak(
      req.user.id,
      req.params.yakId,
      req.body.message,
      req.body.reasonCode,
    );
  }),
];

module.exports = {
  handler,
  apply: reportYak,
};
