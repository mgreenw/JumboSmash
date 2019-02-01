// @flow

const _ = require('lodash');
const scenes = require('./scenes');

function sceneIsValid(scene: string): boolean {
  return _.includes(scenes, scene);
}

module.exports = sceneIsValid;
