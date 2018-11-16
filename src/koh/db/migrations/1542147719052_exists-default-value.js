exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('members', 'exists', {
    default: true,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('members', 'exists', {
    default: null,
  });
};
