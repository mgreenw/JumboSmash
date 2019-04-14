// @flow

module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'jumbosmash_test',
    user: 'postgres',
    password: '',
  },
  secret: 'ohhhhhnoooo!!',
  koh_host: 'http://koh.jumbosmash.com',
  s3_bucket: 'projectgem-dev',
  redis: {
    host: 'localhost',
    port: 6379,
  },
  spotify_client_id: 'd300522fd10f4f02b164d97bcfd9390b',
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET,
};
