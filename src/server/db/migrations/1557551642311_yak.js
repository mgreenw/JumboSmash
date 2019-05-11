exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('yaks', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'classmates',
      notNull: true,
    },
    content: {
      type: 'varchar(300)',
      notNull: true,
    },
    timestamp: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    score: {
      type: 'integer',
      default: 0,
      notNull: true,
    },
  });

  pgm.createTable('yak_votes', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'classmates',
      notNull: true,
    },
    yak_id: {
      type: 'integer',
      references: 'yaks',
      notNull: true,
    },
    liked: {
      type: 'boolean',
      notNull: true,
    },
    updated_timestamp: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('yak_votes');
  pgm.dropTable('yaks');
};
