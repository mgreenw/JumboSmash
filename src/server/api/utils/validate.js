// @flow

import type { $Request, $Response, NextFunction } from 'express';

const AJV = require('ajv');

const codes = require('../status-codes');
const { version } = require('../../utils');

const ajv = new AJV();

// Given a JSON schema object, validate an incoming JSON request.
const validate = (schema: Object) => {
  const validateSchema = ajv.compile(schema);

  return (req: $Request, res: $Response, next: NextFunction) => {
    const { body } = req;

    const valid = validateSchema(body);
    if (valid) {
      return next();
    }

    return res.status(400).json({
      status: codes.BAD_REQUEST.status,
      message: ajv.errorsText(validateSchema.errors),
      version,
    });
  };
};

module.exports = validate;
