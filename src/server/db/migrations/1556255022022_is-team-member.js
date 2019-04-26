exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('profiles', {
    is_team_member: {
      type: 'boolean',
      default: false,
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('profiles', ['is_team_member']);
};
