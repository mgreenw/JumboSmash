exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('verification_codes', {
    email: {
      type: 'varchar(100)',
      notNull: true,
      default: '',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('verification_codes', ['email']);
};
