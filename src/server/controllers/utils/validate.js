// @flow

import type { $Request, $Response, NextFunction } from 'express';

const AJV = require('ajv');

const codes = require('../status-codes');

const ajv = new AJV();

// Given a JSON schema object, validate an incoming JSON request.
const validate = (schema: Object) => {

  const validate = ajv.compile(schema);

  return async (req: $Request, res: $Response, next: NextFunction) => {
    const body = req.body;

    const valid = validate(body);
    if (valid) {
      return next();
    }

    return res.status(400).json({
      status: codes.BAD_REQUEST,
      message: ajv.errorsText(validate.errors),
    });

  };
}

module.exports = validate;
