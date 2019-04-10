// @flow

const newMatchExpo = require('./expo');
const newMatchSocket = require('./socket');

function newMatch(matchingUserId: number, matchedUserId: number, scene: string) {
  // This function is only called once as it handles the send to both users
  newMatchExpo(matchingUserId, matchedUserId, scene);

  // This function is called twice because it only sends the socket update
  // to the matchingUserId (first param)
  newMatchSocket(matchingUserId, matchedUserId, scene, matchingUserId);
  newMatchSocket(matchedUserId, matchingUserId, scene, matchingUserId);
}

module.exports = newMatch;
