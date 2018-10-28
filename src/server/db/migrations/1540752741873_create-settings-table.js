exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumns('profiles', ['use_he', 'use_she', 'use_they', 'want_he', 'want_she', 'want_they', 'created_at']);
  pgm.addColumns('users', {
    want_he: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    want_she: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    want_they: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    use_he: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    use_she: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    use_they: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });

  pgm.renameColumn('profiles', 'user', 'user_id');
};

exports.down = (pgm) => {
  pgm.renameColumn('profiles', 'user_id', 'user');
  pgm.dropColumns('users', ['use_he', 'use_she', 'use_they', 'want_he', 'want_she', 'want_they']);
  pgm.addColumns('profiles', {
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    want_he: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    want_she: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    want_they: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    use_he: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    use_she: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    use_they: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
};
