// @flow

const _ = require('lodash');

function sceneIsValid(scene: string): boolean {
  return _.includes(['smash', 'stone', 'social'], scene);
}

module.exports = sceneIsValid;
