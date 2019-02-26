exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('classmates', {
    expo_push_token: {
      type: 'text',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('classmates', ['expo_push_token']);
};
