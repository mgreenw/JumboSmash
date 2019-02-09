exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('messages', {
    id: 'id',
    timestamp: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    content: {
      type: 'text', // Postgres has no performence difference between text and varchar
      notNull: true,
    },
    sender_user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    receiver_user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('messages');
};
