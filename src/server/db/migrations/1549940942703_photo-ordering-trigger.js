exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.dropConstraint('photos', 'photos_index_check', {
    ifExists: true,
  });
  pgm.createTrigger('photos', 'photos_cap_per_user', {
    when: 'BEFORE',
    operation: ['INSERT'],
    function: 'photos_cap_per_user',
    level: 'ROW',
    language: 'plpgsql',
  },
  `
    BEGIN
      IF ((SELECT count(*) FROM photos WHERE user_id = NEW.user_id) >= 4)
      THEN
          RAISE EXCEPTION 'A user can only have 4 photos. Sorry!';
      END IF;
      RETURN NEW;
    END;
  `);
};

exports.down = (pgm) => {
  pgm.dropTrigger('photos', 'photos_cap_per_user');
  pgm.dropFunction('photos_cap_per_user');
  pgm.addConstraint('photos', 'photos_index_check', {
    check: 'index >= 1 and index <= 4',
  });
};
