exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('yak_votes', 'yak_id', {
    onDelete: 'cascade',
  });
};

exports.down = (pgm) => {

};
