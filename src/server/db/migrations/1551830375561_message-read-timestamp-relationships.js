exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('relationships', {
    critic_message_read_timestamp: {
      type: 'timestamptz',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('relationships', ['critic_message_read_timestamp']);
};
