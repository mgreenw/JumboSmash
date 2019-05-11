// @flow

const DefaultProfileOptions = {
  tableAlias: '',
  buildJSON: false,
};

/*
This function defines the select statement for the profile fields.
It allows some options:
  tableAlias: the name of the alias for the table in the query. Example: 'they_profile'
  buildJSON: instead of returning teh fields directly, this builds the entire profile
             into a JSON object which can then be named and returned as desired.
             See "get-scene-candidates.js" for an example of this
*/
function yakSelect(
  requesterUserIdQueryParam: string, /* The query paramater for the id of the requesting user
                          e.g: $1 or user_id */
  options: typeof DefaultProfileOptions = DefaultProfileOptions, // See options above
) {
  const opts = {
    ...DefaultProfileOptions,
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
