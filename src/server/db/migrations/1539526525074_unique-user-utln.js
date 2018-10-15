exports.shorthands = 'unique-user-utln';

exports.up = (pgm) => {
  pgm.addConstraint('users', 'unique_user_utln', 'UNIQUE(utln)');
  pgm.addColumns('users', {
    email: {
      type: 'varchar(100)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('users', 'unique_user_utln', {});
  pgm.dropColumns('users', ['email'], {});
};
