exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createIndex('yak_votes', ['yak_id', 'user_id'], {
    unique: true,
  });
};

exports.down = (pgm) => {
  pgm.dropIndex('yak_votes', ['yak_id', 'user_id'], {
    name: 'yak_votes_yak_id_user_id_unique_index',
  });
};
