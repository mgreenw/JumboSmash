exports.shorthands = undefined;

exports.up = (pgm) => {
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
      admin_password,
      expo_push_token,
      notifications_enabled,
      can_be_active_in_scenes
    FROM classmates
    WHERE NOT terminated
  `);

  pgm.addConstraint(
    'classmates',
    'can_be_active_in_scenes_check',
    'CHECK (can_be_active_in_scenes OR (NOT (active_smash OR active_social OR active_stone)))',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('classmates', 'can_be_active_in_scenes_check');
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
      admin_password,
      expo_push_token,
      notifications_enabled
    FROM classmates
    WHERE NOT terminated
  `);
};
