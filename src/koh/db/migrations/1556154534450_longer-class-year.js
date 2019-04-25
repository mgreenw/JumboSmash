exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('members', 'class_year', {
    type: 'varchar(50)',
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('members', 'class_year', {
    type: 'varchar(2)',
  });
};
