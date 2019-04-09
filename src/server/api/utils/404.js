// @flow

import type {
  $Request,
  $Response,
} from 'express';

module.exports = function notFound(req: $Request, res: $Response) {
  return res.status(404).send('"Not all those who wander are lost." - J. R. R. Tolkien').end();
};
