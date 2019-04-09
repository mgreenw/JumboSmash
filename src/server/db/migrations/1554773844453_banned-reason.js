exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('classmates', {
    banned_reason: {
      type: 'varchar(500)',
      default: null,
    },
  });
  pgm.addConstraint(
    'classmates',
    'banned_and_banned_reason_both_set',
    'CHECK ((banned AND (banned_reason IS NOT NULL)) OR (NOT banned AND (banned_reason IS NULL)))',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('classmates', 'banned_and_banned_reason_both_set');
  pgm.dropColumns('classmates', ['banned_reason']);
};
