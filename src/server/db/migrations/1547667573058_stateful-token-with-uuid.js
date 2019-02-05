exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    token_uuid: {
      type: 'uuid',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['token_uuid']);
};
