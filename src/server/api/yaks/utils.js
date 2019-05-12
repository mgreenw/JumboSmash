// @flow

const _ = require('lodash');

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

type YakPostAvailibality = {
  yaksRemaining: number,
  nextPostTimestamp: Date | null,
};

const YAKS_PER_DAY = 3;
const ONE_DAY_MS = 86400000;

// NOTE: Yaks must be sorted ASC by timestamp and must only be from last 24 hours
function getYakPostAvailability(yaks: { timestamp: Date }[]): YakPostAvailibality {
  // Ensure they are sorted and filtered by last day
  const oneDayAgo = new Date().getTime() - ONE_DAY_MS;
  const pastDayYaks = _.sortBy(
    yaks.filter(yak => yak.timestamp.getTime() > oneDayAgo),
    yak => yak.timestamp,
  );

  // If none, allow full yaks per day
  if (pastDayYaks.length === 0) {
    return {
      yaksRemaining: YAKS_PER_DAY,
      nextPostTimestamp: null,
    };
  }

  // Calculate and return yaksRemaining and nextYakTimestamp
  // If somehow there are more than YAK_PER_DAY, this handles that safely.
  const nextPostIndex = Math.max(pastDayYaks.length - YAKS_PER_DAY, 0);
  const nextPostTimestamp = new Date(
    pastDayYaks[nextPostIndex].timestamp.getTime() + ONE_DAY_MS,
  );
  const yaksRemaining = Math.max(YAKS_PER_DAY - pastDayYaks.length, 0);

  return {
    yaksRemaining,
    nextPostTimestamp,
  };
}

module.exports = {
  yakSelect,
  getYakPostAvailability,
};
