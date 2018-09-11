// @flow
import SQL from 'sql-template-strings';

export default {
  id: 'foobaravg',
  getSQL: (args: any[]) => {
    return SQL`
      SELECT foo.n AS fn,
      AVG(bar.n) AS bn FROM foo
      JOIN bar ON foo.n = bar.n
      WHERE foo.n > ${args[0]}
      GROUP BY foo.n
      ORDER BY foo.n DESC
    `;
  },
  validate: (args: any[]) => {
    if (args.length > 1) {
      return false;
    }
    if (args[0].constructor !== Number) {
      return false;
    }

    return true;
  }
};
