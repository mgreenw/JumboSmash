exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('members', {
    id: 'id',
    utln: {
      type: 'citext',
      notNull: true,
      unique: true,
    },
    exists: {
      type: 'boolean',
      notNull: true,
    },
    email: {
      type: 'varchar(300)',
    },
    college: {
      type: 'varchar(300)',
    },
    trunk_id: {
      type: 'varchar(300)',
    },
    class_year: {
      type: 'varchar(2)',
    },
    display_name: {
      type: 'varchar(300)',
    },
    last_name: {
      type: 'varchar(300)',
    },
    given_name: {
      type: 'varchar(300)',
    },
    major: {
      type: 'varchar(300)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('members');
};
