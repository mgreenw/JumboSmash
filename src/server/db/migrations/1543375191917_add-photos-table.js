exports.shorthands = undefined;
exports.up = (pgm) => {
  pgm.createTable('photos', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'cascade',
    },
    index: {
      type: 'smallint',
      notNull: true,
      check: 'index >= 1 and index <= 4',
    },
    uuid: {
      type: 'uuid',
      notNull: true,
      unique: true,
    },
  });
  pgm.createIndex('photos', ['id', 'user_id'], {
    unique: true,
  });
  pgm.createIndex('photos', ['user_id', 'index'], {
    unique: true,
  });
  pgm.createTable('unconfirmed_photos', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      unique: true,
      onDelete: 'cascade',
    },
    uuid: {
      type: 'uuid',
      notNull: true,
      unique: true,
    },
  });
  pgm.dropColumns('profiles', ['image1_url', 'image2_url', 'image3_url', 'image4_url']);
  pgm.addColumns('profiles', {
    splash_photo_id: {
      type: 'int',
      notNull: true,
      unique: true,
    },
  });
  pgm.addConstraint('profiles', 'profiles_photo_exists', `
    foreign key (user_id, splash_photo_id) references photos (user_id, id) on delete restrict
  `);
};
exports.down = (pgm) => {
  pgm.dropTable('unconfirmed_photos');
  pgm.dropConstraint('profiles', 'profiles_photo_exists');
  pgm.dropColumns('profiles', ['splash_photo_id']);
  pgm.addColumns('profiles', {
    image1_url: {
      type: 'text',
      notNull: true,
      default: '',
    },
    image2_url: {
      type: 'text',
    },
    image3_url: {
      type: 'text',
    },
    image4_url: {
      type: 'text',
    },
  });
  pgm.dropIndex('photos', ['user_id', 'index'], {
    name: 'photos_user_id_index_unique_index',
  });
  pgm.dropIndex('photos', ['id', 'user_id'], {
    name: 'photos_id_user_id_unique_index',
  });
  pgm.dropTable('photos');
};
