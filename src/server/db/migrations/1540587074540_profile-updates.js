exports.shorthands = undefined;

exports.up = (pgm) => {
  /* eslint-disable */
  console.log(`
HEADS UP!!!!
You may need to remove all rows from these tables before running this migration:
  - users
  - verification_codes
  `);
  /* eslint-enable */

  pgm.dropColumns('users', ['utln', 'email']);

  pgm.alterColumn('verification_codes', 'utln', {
    type: 'citext',
    unique: true,
  });

  pgm.alterColumn('verification_codes', 'email', {
    type: 'citext',
    unique: true,
  });

  pgm.renameColumn('verification_codes', 'verification_attempts', 'attempts');

  pgm.renameColumn('users', 'is_he', 'use_he');
  pgm.renameColumn('users', 'is_she', 'use_she');
  pgm.renameColumn('users', 'is_they', 'use_they');

  pgm.renameColumn('users', 'wants_he', 'want_he');
  pgm.renameColumn('users', 'wants_she', 'want_she');
  pgm.renameColumn('users', 'wants_they', 'want_they');


  pgm.alterColumn('users', 'display_name', {
    notNull: true,
    type: 'varchar(100)',
  });

  pgm.renameTable('users', 'profiles');

  pgm.createTable('users', {
    id: 'id',
    utln: {
      type: 'citext',
      notNull: true,
      unique: true,
    },
    email: {
      type: 'citext',
      notNull: true,
      unique: true,
    },
    successful_logins: {
      type: 'integer',
      notNull: true,
      default: 1,
    },
  });

  pgm.addColumns('profiles', {
    user: {
      type: 'integer',
      references: 'users',
      unique: true,
      notNull: true,
      onDelete: 'cascade',
    },
    birthday: {
      type: 'date',
      notNull: true,
    },
    image1_url: {
      type: 'text',
      notNull: true,
    },
    image2_url: {
      type: 'text',
    },
    image3_url: {
      type: 'text',
    },
    image4_url: {
      type: 'text',
    },
    bio: {
      type: 'text',
      notNull: true,
      default: '',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('profiles', ['user', 'birthday', 'image1_url', 'image2_url', 'image3_url', 'image4_url', 'bio']);
  pgm.dropTable('users');

  pgm.renameTable('profiles', 'users');
  pgm.alterColumn('users', 'display_name', {
    notNull: false,
    type: 'text',
  });

  pgm.renameColumn('users', 'want_he', 'wants_he');
  pgm.renameColumn('users', 'want_she', 'wants_she');
  pgm.renameColumn('users', 'want_they', 'wants_they');
  pgm.renameColumn('users', 'use_he', 'is_he');
  pgm.renameColumn('users', 'use_she', 'is_she');
  pgm.renameColumn('users', 'use_they', 'is_they');

  pgm.renameColumn('verification_codes', 'attempts', 'verification_attempts');

  pgm.alterColumn('verification_codes', 'utln', {
    type: 'varchar(100)',
    unique: true,
  });

  pgm.alterColumn('verification_codes', 'email', {
    type: 'varchar(100)',
  });

  pgm.addColumns('users', {
    utln: {
      type: 'varchar(100)',
      unique: true,
    },
    email: {
      type: 'varchar(100)',
      unique: true,
    },
  });
};
