// @flow
import _ from 'lodash';
import type { Scene } from 'mobile/reducers';

const COPY: {
  loading: string[],
  newMessage: {
    smash: string[],
    social: string[],
    stone: string[]
  }
} = require('./CopyStatements.json');

const RemainingLoadingStatements = {
  loading: _.shuffle(COPY.loading)
};

const RemainingNewMessageStatements = {
  smash: _.shuffle(COPY.newMessage.smash),
  social: _.shuffle(COPY.newMessage.social),
  stone: _.shuffle(COPY.newMessage.stone)
};

function randomLoadingStatement(): string {
  const statement = RemainingLoadingStatements.loading.pop();
  // Not using RemainingStatments immutably because this is so straightforward.
  if (RemainingLoadingStatements.loading.length === 0) {
    RemainingLoadingStatements.loading = _.shuffle(COPY.loading);
  }
  return statement;
}

function randomNewMessageStatement(scene: Scene) {
  const statement = RemainingNewMessageStatements[scene].pop();
  if (RemainingNewMessageStatements[scene].length === 0) {
    RemainingNewMessageStatements[scene] = _.shuffle(COPY.newMessage[scene]);
  }
  return statement;
}

export { randomLoadingStatement, randomNewMessageStatement };
