exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('relationships', {
    liked_smash_timestamp: {
      type: 'timestamptz',
    },
    liked_social_timestamp: {
      type: 'timestamptz',
    },
    liked_stone_timestamp: {
      type: 'timestamptz',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('relationships', ['liked_smash_timestamp', 'liked_social_timestamp', 'liked_stone_timestamp']);
};
