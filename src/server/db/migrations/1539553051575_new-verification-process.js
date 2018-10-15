exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('verification_codes', {
    id: 'id',
    utln: {
      type: 'varchar(100)',
      notNull: true,
      unique: true,
    },
    code: {
      type: 'varchar(6)',
      notNull: true,
    },
    expiration: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    verification_attempts: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    email_sends: {
      type: 'integer',
      notNull: true,
      default: 1,
    },
    last_email_send: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
  pgm.dropColumns('users', ['verified', 'verification_hash', 'verification_expire_date', 'password']);
};

exports.down = (pgm) => {
  pgm.dropTable('verification_codes');
  pgm.addColumns('users', {
    verified: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
    verification_hash: {
      type: 'varchar(40)',
      notNull: true,
      default: '',
    },
    verification_expire_date: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    password: {
      type: 'varchar(300)',
      notNull: true,
      default: 'this-is-a-bad-password',
    },
  });
};
