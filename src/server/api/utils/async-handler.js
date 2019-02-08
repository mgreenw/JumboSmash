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
<<<<<<< HEAD
=======
        // Given the promise resolves, return the response's status and the body
>>>>>>> master
        res.status(response.statusCode).json(response.body);
      })
      // If the promise fails, call the next middleware with the error
      // this will go to the error handler in /api/index.js
      .catch(next);
  };
};

module.exports = asyncHandler;
