// @flow

const DefaultYakOptions = {
  tableAlias: '',
  buildJSON: false,
};

/*
This function defines the select statement for a yak
It allows some options:
  tableAlias: the name of the alias for the table in the query. Example: 'yak'
  buildJSON: instead of returning the fields directly, this builds the yak
             into a JSON object which can then be named and returned as desired.
*/
function yakSelect(
  requesterUserIdQueryParam: string, /* The query paramater for the id of the requesting user
                          e.g: $1 or user_id */
  options: typeof DefaultYakOptions = DefaultYakOptions, // See options above
) {
  const opts = {
    ...DefaultYakOptions,
    ...options,
  };
  const tableName = opts.tableAlias === '' ? '' : `${opts.tableAlias}.`;

  // Return json or regular select depending on options
  if (opts.buildJSON) {
    return `
      json_build_object(
        'id', ${tableName}id,
        'score', ${tableName}score,
        'content', ${tableName}content,
        'timestamp', ${tableName}timestamp,
        'fromClient', ${tableName}user_id = $1
      )
    `;
  }

  return `
    ${tableName}id,
    ${tableName}score,
    ${tableName}content,
    ${tableName}timestamp,
    ${tableName}user_id = $1 AS "fromClient"
  `;
}

module.exports = {
  yakSelect,
};
