exports.shorthands = undefined;

exports.up = (pgm) => {
  // Fix relationships columns for swiping
  pgm.renameColumn('relationships', 'liked', 'liked_smash');
  pgm.addColumns('relationships', {
    liked_social: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    liked_stone: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
  pgm.alterColumn('relationships', 'last_swipe_timestamp', {
    default: pgm.func('current_timestamp'),
  });

  // This is somewhat dumb - in a previous migration, we decided to rename
  // "users" to "profiles", which switched the foreign keys originally defined
  // for the relationships table. This corrects that error
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
  pgm.alterColumn('relationships', 'last_swipe_timestamp', {
    default: null,
  });
  pgm.dropColumns('relationships', ['liked_social', 'liked_stone']);
  pgm.renameColumn('relationships', 'liked_smash', 'liked');
};
