exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn('messages', 'timestamp', {
    type: 'timestamptz',
  });
  pgm.alterColumn('relationships', 'created_at', {
    type: 'timestamptz',
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('messages', 'timestamp', {
    type: 'timestamp',
  });
  pgm.alterColumn('relationships', 'created_at', {
    type: 'timestamptz',
  });
};
