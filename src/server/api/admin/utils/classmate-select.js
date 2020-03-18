// @flow

module.exports = `
  id,
  utln,
  email,
  terminated AS "isTerminated",
  json_build_object(
    'canBeSwipedOn', can_be_swiped_on,
    'canBeActiveInScenes', can_be_active_in_scenes
  ) AS "capabilities",
  profile_status AS "profileStatus",
  COALESCE((SELECT TRUE FROM profiles where user_id = classmates.id), false) AS "hasProfile",
  json_build_object(
    'smash', active_smash,
    'social', active_social,
    'stone', active_stone
  ) AS "activeScenes",
  admin_password IS NOT NULL AS "isAdmin",
  COALESCE((SELECT blocked FROM relationships WHERE critic_user_id = id AND candidate_user_id = $1), false) AS "blockedRequestingAdmin",
  json_build_object(
    'notificationsEnabled', notifications_enabled,
    'hasToken', expo_push_token IS NOT NULL
  ) AS "notificationInfo"
`;
