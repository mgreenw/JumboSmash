exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropTable('admins');
  pgm.dropView('users');
  pgm.dropColumns('classmates', ['is_admin']);

  // I know what you're thinking. AH, THESE AREN'T HASHED! And you're right.
  // But, we are not worried about our few randomly generated admin passwords
  // getting out. So, we don't need to hash. That makes it so so so much easier
  pgm.addColumns('classmates', {
    admin_password: {
      type: 'varchar(100)',
      default: null,
      check: 'char_length(admin_password) >= 8',
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
      admin_password,
      expo_push_token
    FROM classmates
    WHERE NOT banned
  `);
};

exports.down = (pgm) => {
  pgm.createTable('admins', {
    id: 'id',
    utln: {
      type: 'citext',
      unique: true,
    },
  });
  pgm.dropView('users');
  pgm.dropColumns('classmates', ['admin_password']);
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
      is_admin,
      expo_push_token
    FROM classmates
    WHERE NOT banned
  `);
};
