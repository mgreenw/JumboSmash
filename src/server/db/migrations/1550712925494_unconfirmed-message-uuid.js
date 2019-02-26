exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('messages', {
    unconfirmed_message_uuid: {
      type: 'uuid',
      notNull: true,
      unique: true,
      default: pgm.func('md5(random()::text || clock_timestamp()::text)::uuid'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('messages', ['unconfirmed_message_uuid']);
};
