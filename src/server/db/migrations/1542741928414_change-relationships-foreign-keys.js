exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint('profiles', 'users_pkey', {
    ifExists: true,
  });
  pgm.dropColumns('profiles', 'id');
  pgm.addConstraint('profiles', 'profile_user_pkey', {
    primaryKey: 'user_id',
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('profiles', 'profile_user_pkey');
  pgm.addColumns('profiles', {
    id: 'id',
  });
};
