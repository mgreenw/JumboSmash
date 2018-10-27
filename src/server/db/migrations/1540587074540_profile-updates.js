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

  pgm.dropConstraint('users', 'unique_user_utln');
  pgm.createIndex('users', 'lower(utln)', {
    unique: true,
  });
  pgm.dropConstraint('verification_codes', 'verification_codes_utln_key');
  pgm.createIndex('verification_codes', 'lower(utln)', {
    unique: true,
  });

  pgm.createIndex('users', 'lower(email)', {
    unique: true,
  });
  pgm.createIndex('verification_codes', 'lower(email)', {
    unique: true,
  });

  pgm.renameColumn('verification_codes', 'verification_attempts', 'attempts');

  pgm.renameColumn('users', 'is_he', 'use_he');
  pgm.renameColumn('users', 'is_she', 'use_she');
  pgm.renameColumn('users', 'is_they', 'use_they');

  pgm.renameColumn('users', 'wants_he', 'want_he');
  pgm.renameColumn('users', 'wants_she', 'want_she');
  pgm.renameColumn('users', 'wants_they', 'want_they');

  pgm.addColumns('users', {
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

  pgm.alterColumn('users', 'display_name', {
    notNull: true,
    type: 'varchar(100)',
  });

  pgm.createTable('onboarding_users', {
    id: 'id',
    utln: {
      type: 'varchar(100)',
      notNull: true,
    },
  });

  pgm.createIndex('onboarding_users', 'lower(utln)', {
    unique: true,
  });
};

exports.down = (pgm) => {
  pgm.dropIndex('users', 'utln', {
    name: 'users_lower(utln)_unique_index',
  });
  pgm.addConstraint('users', 'unique_user_utln', 'UNIQUE(utln)');
  pgm.dropIndex('verification_codes', 'utln', {
    name: 'verification_codes_lower(utln)_unique_index',
  });

  pgm.dropIndex('users', 'email', {
    name: 'users_lower(email)_unique_index',
  });

  pgm.dropIndex('verification_codes', 'email', {
    name: 'verification_codes_lower(email)_unique_index',
  });

  pgm.addConstraint('verification_codes', 'verification_codes_utln_key', 'UNIQUE(utln)');

  pgm.renameColumn('verification_codes', 'attempts', 'verification_attempts');
  pgm.renameColumn('users', 'use_he', 'is_he');
  pgm.renameColumn('users', 'use_she', 'is_she');
  pgm.renameColumn('users', 'use_they', 'is_they');

  pgm.renameColumn('users', 'want_he', 'wants_he');
  pgm.renameColumn('users', 'want_she', 'wants_she');
  pgm.renameColumn('users', 'want_they', 'wants_they');

  pgm.dropColumns('users', ['birthday', 'image1_url', 'image2_url', 'image3_url', 'image4_url', 'bio']);

  pgm.alterColumn('users', 'display_name', {
    notNull: false,
    type: 'text',
  });

  pgm.dropTable('onboarding_users', {
    cascade: true,
  });

  pgm.dropIndex('onboarding_users', 'utln', {
    name: 'onboarding_users_lower(utln)_unique_index',
  });
};
