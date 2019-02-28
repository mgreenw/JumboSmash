exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('testers', {
    id: 'id',
    utln: {
      type: 'citext',
      unique: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('testers');
};
