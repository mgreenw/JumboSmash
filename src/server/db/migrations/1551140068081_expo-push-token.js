exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('classmates', {
    expo_push_token: {
      type: 'text',
      default: null,
    },
  });
  pgm.createView('users', { replace: true }, `
    SELECT
      id,
      utln,
      email,
      successful_logins,
      want_he,
      want_she,
      want_they,
      use_he,
      use_she,
      use_they,
      active_smash,
      active_social,
      active_stone,
      token_uuid,
      is_admin,
      expo_push_token
    FROM classmates
    WHERE NOT banned
  `);
};

exports.down = (pgm) => {
  pgm.dropView('users');
  pgm.createView('users', { replace: true }, `
    SELECT
      id,
      utln,
      email,
      successful_logins,
      want_he,
      want_she,
      want_they,
      use_he,
      use_she,
      use_they,
      active_smash,
      active_social,
      active_stone,
      token_uuid,
      is_admin
    FROM classmates
    WHERE NOT banned
  `);
  pgm.dropColumns('classmates', ['expo_push_token']);
};
