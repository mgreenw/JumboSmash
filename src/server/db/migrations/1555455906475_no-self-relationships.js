exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint(
    'relationships',
    'critic_not_candidate',
    'CHECK (critic_user_id != candidate_user_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('relationships', 'critic_not_candidate');
};
