exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('relationships', 'liked_smash_timestamp', 'swiped_smash_timestamp');
  pgm.renameColumn('relationships', 'liked_social_timestamp', 'swiped_social_timestamp');
  pgm.renameColumn('relationships', 'liked_stone_timestamp', 'swiped_stone_timestamp');
  pgm.dropColumns('relationships', ['last_swipe_timestamp']);
};

exports.down = (pgm) => {
  pgm.addColumns('relationships', {
    last_swipe_timestamp: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.renameColumn('relationships', 'swiped_smash_timestamp', 'liked_smash_timestamp');
  pgm.renameColumn('relationships', 'swiped_social_timestamp', 'liked_social_timestamp');
  pgm.renameColumn('relationships', 'swiped_stone_timestamp', 'liked_stone_timestamp');
};
