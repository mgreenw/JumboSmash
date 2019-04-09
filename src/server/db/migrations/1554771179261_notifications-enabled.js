exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropView('users');
  pgm.addColumns('classmates', {
    notifications_enabled: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
  // This may cause an issue: manually deal with it if so
  pgm.alterColumn('classmates', 'expo_push_token', {
    type: 'text',
    default: null,
    unique: true,
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
      admin_password,
      expo_push_token,
      notifications_enabled
    FROM classmates
    WHERE NOT banned
  `);
};

exports.down = (pgm) => {
  pgm.dropView('users');
  pgm.dropColumns('classmates', ['notifications_enabled']);
  pgm.alterColumn('classmates', 'expo_push_token', {
    type: 'text',
    default: null,
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
      admin_password,
      expo_push_token
    FROM classmates
    WHERE NOT banned
  `);
};
