// @flow
import _ from 'lodash';
import foobaravg from './foobaravg';
import courses from './courses';

const requiredKeys = ['id', 'getSQL', 'validate'];
const definitions = [foobaravg, courses];

function generateDefinitions() {
  return _.reduce(
    definitions,
    (curr, definition) => {
      // Ensure definition has required components
      _.forEach(requiredKeys, key => {
        if (!(key in definition)) {
          console.log(
            `Ignoring definition because missing ${key}: ${definition}`
          );
          return curr;
        }
      });

      curr[definition.id] = definition;
      return curr;
    },
    {}
  );
}

export default generateDefinitions();
