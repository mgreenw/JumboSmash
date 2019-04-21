exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('profiles', {
    spring_fling_act_artist: {
      type: 'json',
      default: null,
    },
  });

  pgm.addConstraint(
    'profiles',
    'spring_fling_act_artist_both',
    'CHECK ((num_nulls(spring_fling_act, spring_fling_act_artist) = 2) OR (num_nulls(spring_fling_act, spring_fling_act_artist) = 0))',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('profiles', 'spring_fling_act_artist_both');
  pgm.dropColumns('profiles', ['spring_fling_act_artist']);
};
