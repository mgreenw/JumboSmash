// @flow
import SQL from 'sql-template-strings';

export default {
  id: 'courses',
  getSQL: (args: any[]) => {
    return SQL`
      SELECT id, name from courses
    `;
  },
  validate: (args: any[]) => {
    return true;
  }
};
