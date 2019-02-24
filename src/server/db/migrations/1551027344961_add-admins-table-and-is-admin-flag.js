exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('admins', {
    id: 'id',
    utln: {
      type: 'citext',
      unique: true,
    },
  });
  pgm.addColumns('classmates', {
    is_admin: {
      type: 'boolean',
      default: false,
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
      is_admin
    FROM classmates
    WHERE NOT banned
  `);
};

exports.down = (pgm) => {
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
      token_uuid
    FROM classmates
    WHERE NOT banned
  `);
  pgm.dropColumns('classmates', ['is_admin']);
  pgm.dropTable('admins');
};
