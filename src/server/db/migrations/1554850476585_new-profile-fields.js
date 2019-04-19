exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('profiles', {
    postgrad_region: {
      type: 'varchar(100)',
      default: null,
      check: 'char_length(spring_fling_act) > 0',
    },
    freshman_dorm: {
      type: 'varchar(100)',
      default: null,
      check: 'char_length(spring_fling_act) > 0',
    },
    spring_fling_act: {
      type: 'varchar(200)',
      default: null,
      check: 'char_length(spring_fling_act) > 0',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('profiles', ['postgrad_region', 'freshman_dorm', 'spring_fling_act']);
};
