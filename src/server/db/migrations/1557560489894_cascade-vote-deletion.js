exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint('yak_votes', 'yak_votes_yak_id_fkey');
  pgm.addConstraint('yak_votes', 'yak_votes_yak_id_fkey', {
    foreignKeys: {
      columns: 'yak_id',
      references: 'yaks',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('yak_votes', 'yak_votes_yak_id_fkey');
  pgm.addConstraint('yak_votes', 'yak_votes_yak_id_fkey', {
    foreignKeys: {
      columns: 'yak_id',
      references: 'yaks',
    },
  });
};
