exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('relationships', {
    critic_read_message_timestamp: {
      type: 'timestamptz',
    },
    critic_read_message_id: {
      type: 'integer',
      references: 'messages',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('relationships', ['critic_read_message_timestamp', 'critic_read_message_id']);
};
