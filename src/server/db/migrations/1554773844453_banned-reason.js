exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropView('users');
  pgm.addColumns('classmates', {
    banned_reason: {
      type: 'varchar(500)',
      default: null,
    },
  });
  pgm.addConstraint(
    'classmates',
    'banned_and_banned_reason_both_set',
    'CHECK ((banned AND (banned_reason IS NOT NULL)) OR (NOT banned AND (banned_reason IS NULL)))',
  );
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

exports.down = (pgm) => {
  pgm.dropView('users');
  pgm.dropConstraint('classmates', 'banned_and_banned_reason_both_set');
  pgm.dropColumns('classmates', ['banned_reason']);

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
