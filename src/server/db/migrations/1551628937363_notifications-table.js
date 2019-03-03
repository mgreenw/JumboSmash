exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('notification_status', ['pending', 'ok', 'error']);
  pgm.createTable('notifications', {
    id: 'id',
    user_id: {
      type: 'integer',
      references: 'classmates',
    },
    ticket_id: {
      type: 'text',
      notNull: true,
    },
    sent_timestamp: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
      notNull: true,
    },
    status: {
      type: 'notification_status',
      default: 'pending',
      notNull: true,
    },
    expo_push_token: {
      type: 'text',
      notNull: true,
    },
    message: {
      type: 'text',
    },
    error_details: {
      type: 'text',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('notifications');
  pgm.dropType('notification_status');
};
