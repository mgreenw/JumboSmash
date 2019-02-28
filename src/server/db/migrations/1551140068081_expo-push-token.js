exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('classmates', {
    expo_push_token: {
      type: 'text',
      default: null,
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
  pgm.dropView('users');
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
  pgm.dropColumns('classmates', ['expo_push_token']);
};
