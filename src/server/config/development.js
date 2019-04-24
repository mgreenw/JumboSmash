const fs = require('fs');

module.exports = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'jumbosmash',
    user: 'jumbosmashdev',
    password: 'tonysmash2019',
  },
  secret: 'ohhhhhnoooo!!',
  koh_host: 'http://koh.jumbosmash.com',
  s3_bucket: 'projectgem-dev',
  redis: {
    host: 'localhost',
    port: 6379,
  },
  launch_date: '2019-04-22T19:20:37.883Z',
  spotify_client_id: 'd300522fd10f4f02b164d97bcfd9390b',
  spotify_client_secret: fs.readFileSync(`${__dirname}/../spotify_client_secret`, 'utf8').trim(),
};
