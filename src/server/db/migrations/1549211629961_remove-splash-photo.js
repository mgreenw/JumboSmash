exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropColumns('profiles', ['splash_photo_id']);
};

exports.down = (pgm) => {
  pgm.addColumns('profiles', {
    splash_photo_id: {
      type: 'int',
      unique: true,
    },
  });
  pgm.addConstraint('profiles', 'profiles_photo_exists', `
    foreign key (user_id, splash_photo_id) references photos (user_id, id) on delete restrict
  `);
};
