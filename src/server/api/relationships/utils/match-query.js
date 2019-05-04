// @flow

const { profileSelectQuery } = require('../../users/utils');
const utilScenes = require('./scenes');

const scenes = utilScenes.map(scene => `'${scene}'`).join(',');

const matchedScenesSelect = utilScenes.map((scene) => {
  return `
    CASE
      me_critic.liked_${scene} AND they_critic.liked_${scene}
      WHEN true
        THEN GREATEST(me_critic.swiped_${scene}_timestamp, they_critic.swiped_${scene}_timestamp)
        ELSE NULL
    END`;
});

const query = `
  WITH user_messages AS (
    SELECT
      CASE
        WHEN sender_user_id = $1 THEN receiver_user_id
        ELSE sender_user_id
      END AS other_user_id,
      CASE
        WHEN from_system IS true THEN 'system'
        WHEN sender_user_id = $1 THEN 'client'
        ELSE 'match'
      END AS sender,
      id,
      timestamp,
      content,
      from_system
    FROM messages
    WHERE sender_user_id = $1 OR receiver_user_id = $1
  ), user_messages_agg AS (
    SELECT every(from_system) AS new_match, other_user_id
    FROM user_messages
    GROUP by other_user_id
  ), most_recent_messages AS (
    SELECT DISTINCT ON (other_user_id) *
    FROM user_messages
    ORDER BY other_user_id, timestamp DESC
  )
  SELECT
    they_profile.user_id as "userId",
    ${profileSelectQuery('they_profile.user_id', { tableAlias: 'they_profile', buildJSON: true })} AS profile,
    json_object(ARRAY[${scenes}], ARRAY[
      ${matchedScenesSelect.join(',')}
    ]::text[]) AS scenes,
    CASE
      WHEN most_recent_message.id IS NULL THEN NULL
      ELSE json_build_object(
        'messageId', most_recent_message.id,
        'content', most_recent_message.content,
        'timestamp', most_recent_message.timestamp,
        'sender', most_recent_message.sender
      )
    END AS "mostRecentMessage",
    user_messages_agg.new_match AS "newMatch"
  FROM relationships me_critic
  JOIN relationships they_critic
    ON they_critic.candidate_user_id = $1
    AND they_critic.critic_user_id = me_critic.candidate_user_id
  JOIN profiles they_profile
    ON they_profile.user_id = me_critic.candidate_user_id
  JOIN classmates them
    ON they_profile.user_id = them.id
  LEFT JOIN most_recent_messages most_recent_message ON most_recent_message.other_user_id = they_profile.user_id
  LEFT JOIN user_messages_agg ON user_messages_agg.other_user_id = they_profile.user_id
  WHERE
    me_critic.critic_user_id = $1
`;

module.exports = query;
