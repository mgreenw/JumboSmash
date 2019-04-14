exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType('profile_status', ['unreviewed', 'reviewed', 'updated']);
  pgm.addColumns('classmates', {
    can_be_swiped_on: {
      type: 'boolean',
      notNull: true,
      default: false, // From the onset, users cannot be swiped on until reviewed.
    },
    can_be_active_in_scenes: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    profile_status: {
      type: 'profile_status',
      default: 'unreviewed',
      notNull: true,
    },
    review_log: {
      type: 'jsonb',
      default: '[]',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('classmates', ['can_be_swiped_on', 'can_be_active_in_scenes', 'profile_status', 'review_log']);
  pgm.dropType('profile_status');
};
