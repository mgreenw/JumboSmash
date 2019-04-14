exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropView('users');
  pgm.renameColumn('classmates', 'banned', 'terminated');
  pgm.renameColumn('classmates', 'banned_reason', 'termination_reason');
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
    WHERE NOT terminated
  `);
};

exports.down = (pgm) => {
  pgm.dropView('users');
  pgm.renameColumn('classmates', 'terminated', 'banned');
  pgm.renameColumn('classmates', 'termination_reason', 'banned_reason');
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
