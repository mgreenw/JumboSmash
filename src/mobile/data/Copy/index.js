// @flow
import _ from 'lodash';

const COPY: {
  loading: string[]
} = require('./CopyStatements.json');

const RemainingStatements = {
  loading: _.shuffle(COPY.loading)
};

function randomLoadingStatement(): string {
  const statement = RemainingStatements.loading.pop();
  // Not using RemainingStatments immutably because this is so straightforward.
  if (RemainingStatements.loading.length === 0) {
    RemainingStatements.loading = _.shuffle(COPY.loading);
  }
  return statement;
}

export { randomLoadingStatement };
