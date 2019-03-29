exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('relationships', {
    critic_read_message_timestamp: {
      type: 'timestamptz',
      default: null,
    },
    critic_read_message_id: {
      type: 'integer',
      references: 'messages',
      default: null,
    },
  });

  pgm.addConstraint(
    'relationships',
    'read_message_id_and_timestamp_both_null_or_exist',
    'CHECK ((num_nulls(critic_read_message_timestamp, critic_read_message_id) = 2) OR (num_nulls(critic_read_message_timestamp, critic_read_message_id) = 0))',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('relationships', 'read_message_id_and_timestamp_both_null_or_exist');
  pgm.dropColumns('relationships', ['critic_read_message_timestamp', 'critic_read_message_id']);
};
