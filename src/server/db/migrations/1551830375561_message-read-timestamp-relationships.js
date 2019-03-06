exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('relationships', {
    message_read_timestamp: {
      type: 'timestamptz',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('relationships', ['message_read_timestamp']);
};
