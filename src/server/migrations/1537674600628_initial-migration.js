exports.shorthands = undefined;

exports.up = (pgm) => {
  // Create the users table!
  pgm.createTable('users', {
    id: 'id',
    email: {
      type: 'varchar(100)',
      notNull: true,
    },
    password: {
      type: 'varchar(300)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    display_name: {
      type: 'string',
      notNull: true,
    },
    wants_he: {
      type: 'boolean',
      notNull: true,
    },
    wants_she: {
      type: 'boolean',
      notNull: true,
    },
    wants_they: {
      type: 'boolean',
      notNull: true,
    },
    is_he: {
      type: 'boolean',
      notNull: true,
    },
    is_she: {
      type: 'boolean',
      notNull: true,
    },
    is_they: {
      type: 'boolean',
      notNull: true,
    },
  });

  // Create the relationships table!
  pgm.createTable('relationships', {
    critic_user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    candidate_user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    liked: {
      type: 'boolean',
      default: 'false',
      notNull: true,
    },
    blocked: {
      type: 'boolean',
      default: 'false',
      notNull: true,
    },
    last_swipe_timestamp: {
      type: 'timestamptz',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Primary key as combination of the critic and candidate user ids
  pgm.addConstraint('relationships', 'pk_critic_candidate', {
    primaryKey: ['critic_user_id', 'candidate_user_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('relationships');
  pgm.dropTable('users');
};
