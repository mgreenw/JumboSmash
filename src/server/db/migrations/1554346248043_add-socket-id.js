exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('classmates', {
    socket_id: {
      type: 'text',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('classmates', ['socket_id']);
};
