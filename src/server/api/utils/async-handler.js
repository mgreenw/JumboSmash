// @flow

import type {
  $Request,
  $Response,
  NextFunction,
  Middleware,
} from 'express';

const asyncHandler = (fn : Middleware) => {
  return (req: $Request, res: $Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next))
      .then((response) => {
        // This is where the magic happens
        res.status(response.statusCode).json(response.body);
      })
      .catch(next);
  };
};

module.exports = asyncHandler;
