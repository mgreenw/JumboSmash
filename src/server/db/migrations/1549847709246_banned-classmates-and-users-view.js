exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameTable('users', 'classmates');
  pgm.addColumns('classmates', {
    banned: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
  pgm.createView('users', {}, `
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
};

exports.down = (pgm) => {
  pgm.dropView('users', { ifExists: true });
  pgm.dropColumns('classmates', ['banned']);
  pgm.renameTable('classmates', 'users');
};
