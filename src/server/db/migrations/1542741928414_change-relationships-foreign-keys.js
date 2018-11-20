exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint('profiles', 'users_pkey', {
    ifExists: true,
  });
  pgm.dropColumns('profiles', 'id');
  pgm.addConstraint('profiles', 'profile_user_pkey', {
    primaryKey: 'user_id',
  });

  // This changes the foreign keys of the users columns in relationships
  // to reference the primary key of profiles (user_id) instead of
  // the primary key of users. This enforces users to make a profile before
  // making any relationships.
  pgm.dropConstraint('relationships', 'relationships_candidate_user_id_fkey', {
    ifExists: true,
  });
  pgm.dropConstraint('relationships', 'relationships_critic_user_id_fkey', {
    ifExists: true,
  });
  pgm.addConstraint('relationships', 'relationships_candidate_user_id_fkey', {
    foreignKeys: {
      columns: 'candidate_user_id',
      references: 'profiles',
      onDelete: 'cascade',
    },
  });
  pgm.addConstraint('relationships', 'relationships_critic_user_id_fkey', {
    foreignKeys: {
      columns: 'critic_user_id',
      references: 'profiles',
      onDelete: 'cascade',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint('relationships', 'relationships_candidate_user_id_fkey', {
    ifExists: true,
  });
  pgm.dropConstraint('relationships', 'relationships_critic_user_id_fkey', {
    ifExists: true,
  });
  pgm.addConstraint('relationships', 'relationships_candidate_user_id_fkey', {
    foreignKeys: {
      columns: 'candidate_user_id',
      references: 'users',
      onDelete: 'cascade',
    },
  });
  pgm.addConstraint('relationships', 'relationships_critic_user_id_fkey', {
    foreignKeys: {
      columns: 'critic_user_id',
      references: 'users',
      onDelete: 'cascade',
    },
  });
  pgm.dropConstraint('profiles', 'profile_user_pkey');
  pgm.addColumns('profiles', {
    id: 'id',
  });
};
