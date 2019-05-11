// @flow

const DefaultYakOptions = {
  yakTableAlias: '',
  yakVotesTableAlias: '',
  buildJSON: false,
};

/*
This function defines the select statement for a yak
It allows some options:
  yakTableAlias: the name of the alias for the table in the query. Example: 'yak'
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
  const yakTableName = opts.yakTableAlias === '' ? '' : `${opts.yakTableAlias}.`;
  const yakVotesTableName = opts.yakVotesTableAlias === '' ? '' : `${opts.yakVotesTableAlias}.`;

  // Return json or regular select depending on options
  if (opts.buildJSON) {
    return `
      json_build_object(
        'id', ${yakTableName}id,
        'score', ${yakTableName}score,
        'content', ${yakTableName}content,
        'timestamp', ${yakTableName}timestamp,
        'postedByClient', ${yakTableName}user_id = $1,
        'clientVote', ${yakVotesTableName}liked
      )
    `;
  }

  return `
      ${yakTableName}id,
      ${yakTableName}score,
      ${yakTableName}content,
      ${yakTableName}timestamp,
      ${yakTableName}user_id = $1 AS "postedByClient",
      ${yakVotesTableName}liked AS "clientVote"
  `;
}

module.exports = {
  yakSelect,
};
