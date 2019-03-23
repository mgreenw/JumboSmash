exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('messages', {
    is_system_message: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('messages', ['is_system_message']);
};
