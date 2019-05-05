// @flow

const db = require('../db');

async function generateUserInfoSection(title: string, userId: number) {
  const [user] = (await db.query(`
    SELECT
      id,
      utln,
      email,
      display_name AS "displayName",
      birthday,
      bio,
      json_build_object(
        'smash', active_smash,
        'social', active_social,
        'stone', active_stone
      ) AS "activeScenes"
    FROM classmates
    JOIN profiles on profiles.user_id = classmates.id
    WHERE id = $1
  `, [userId])).rows;

  if (!user) {
    throw new Error(`Could not find profile for user ${userId}`);
  }

  const activeScenes = Object.entries(user.activeScenes)
    .filter(([, active]) => active)
    .map(([scene]) => scene);

  return [
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*id*: ${user.id}`,
        },
        {
          type: 'mrkdwn',
          text: `*UTLN*: ${user.utln}`,
        },
        {
          type: 'mrkdwn',
          text: `*Email*: ${user.email}`,
        },
        {
          type: 'mrkdwn',
          text: `*Display Name*: ${user.displayName}`,
        },
        {
          type: 'mrkdwn',
          text: `*Birthday*: ${user.birthday.toDateString()}`,
        },
        {
          type: 'mrkdwn',
          text: `*Bio*: ${user.bio}`,
        },
      ],
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Active Scenes: ${activeScenes.length === 0 ? 'None' : activeScenes.join(', ')}`,
        },
      ],
    },
  ];
}

const GOOD = '#339900';
const WARNING = '#ffcc00';
const DANGER = '#cc3300';

const WAVE = '#41c7cb';
const LOBSTER = '#fc6265';
const GEM = '#facc3d';

module.exports = {
  colors: {
    GOOD,
    WARNING,
    DANGER,
    WAVE,
    LOBSTER,
    GEM,
  },
  generateUserInfoSection,
};
