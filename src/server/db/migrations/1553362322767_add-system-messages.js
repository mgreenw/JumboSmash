exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('messages', {
    from_system: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('messages', ['from_system']);
};
