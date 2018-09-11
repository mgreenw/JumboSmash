// @flow
/*

pubId
QUERY TEXT 
variable array

new subscriptions are created only if there is not a current subscription with the same string
id that has the EXACT SAME variable array.

We will store the current publications in an object with the publication string id as the key
and an array of objects that will look like:
subscriptions = {
  [pubId]: {
    [varsKey]: {
      queryId, // from livequery
      sockets: [],
      currResponse: []
    }
  }
}

We will also have a way to access the subscriptions that a socket currently has: 

socketKeys = {
  [socketId]: {
    [key]: {
      pubId,
      variables
    }
  }
}

if a publication with a set of variables has no more subscribed sockets, then livequery will stop
watching that query for changes

when there is a change to a query, all currently subscribed sockets will receive the update

Publications with no variables will store their single query under the 'default' key

Finally, for each subscription we will generate a unique string they can use to 'unsubscribe'.
The key will be generated with using the publication id and the variables to make a string like
${publicationId}-${JSON.stringify(variables)}

We will keep track of the current return value of a publication so we can give it back to new
subscribers.
*/

import _ from 'lodash';

import definitions from './definitions';
import db from '../db';
const sockets = require('../sockets');

const subscriptions = {};
const socketKeys = {};

export function subscribe(
  socketId: string,
  publicationId: string,
  variables: any[]
) {
  // Ensure that all the inputs are valid

  if (socketId.constructor !== String) {
    throw new Error('Oi vey, a socket must be a string!');
  }

  if (publicationId.constructor !== String) {
    throw new Error('Oi veye, a publicationId must be a string!');
  }

  // Todo: performe check that variables contains no objects
  if (variables.constructor !== Array) {
    throw new Error('Oi vey, the variables must come in an array!');
  }

  if (!(publicationId in definitions)) {
    console.log(
      `Failed to subscribee: publication id ${publicationId} does not exist`
    );
    return;
  }

  const definition = definitions[publicationId];

  // Get the common key for this subscription
  const varsKey = JSON.stringify(variables);
  const key = `${publicationId}-${varsKey}`;

  if (!(publicationId in subscriptions)) {
    subscriptions[publicationId] = {};
  }

  const publicationSubs = subscriptions[publicationId];

  if (varsKey in publicationSubs) {
    // Add the socketId to the current subscribed sockets
    publicationSubs[varsKey].sockets.add(socketId);
    const currRows = publicationSubs[varsKey].currResult;
    console.log(sockets);
    sockets.sendDataUpdate(socketId, key, currRows);
    // And that's it!
  } else {
    // Initialize varKey in publicationSubs
    const validated = definition.validate(variables);

    if (!validated) {
      console.log(
        `Could not validate ${JSON.stringify(variables)} for ${publicationId}`
      );
      return;
    }

    const sql = definition.getSQL(variables);
    const id = db.live.watch(sql, rows => {
      if (!_.isEqual(rows, publicationSubs[varsKey].currResult)) {
        publicationSubs[varsKey].currResult = rows;

        publicationSubs[varsKey].sockets.forEach(socketId => {
          sockets.sendDataUpdate(socketId, key, rows);
        });
      }
    });

    publicationSubs[varsKey] = {
      queryId: id,
      sockets: new Set([socketId]),
      currResult: null
    };
  }

  // Ensure socketKeys is updated with the new info
  if (!(socketId in socketKeys)) {
    socketKeys[socketId] = {};
  }

  if (!(key in socketKeys[socketId])) {
    socketKeys[socketId][key] = {
      publicationId,
      variables,
      varsKey,
      key
    };
  }

  console.log(
    `Successfully subscribed ${socketId} to ${publicationId} with ${JSON.stringify(
      variables
    )} and key ${key}`
  );

  console.log(subscriptions, socketKeys);

  return key;
}

export function unsubscribe(socketId: string, key: string) {
  // Ensure that all the inputs are valid

  if (socketId.constructor !== String) {
    throw new Error('Oi vey, a socket must be a string!');
  }

  if (key.constructor !== String) {
    throw new Error('Oi vey, a key must be a string!');
  }

  // Todo: add additional validation to this call
  const details = socketKeys[socketId][key];
  const subscription = subscriptions[details.publicationId][details.varsKey];

  // Remove the socket
  subscription.sockets.delete(socketId);
  if (subscription.sockets.size === 0) {
    // Delete the subscription!

    db.live.stopWatching(subscription.queryId);
    delete subscriptions[details.publicationId][details.varsKey];

    console.log(`Stopped watching ${key}`);
  }

  delete socketKeys[socketId][key];

  if (Object.keys(socketKeys[socketId]).length === 0) {
    delete socketKeys[socketId];
  }
  console.log(`Unsubscribed ${socketId} from key ${key}`);
  console.log(subscriptions, socketKeys);
}
