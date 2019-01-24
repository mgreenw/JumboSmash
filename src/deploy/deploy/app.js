// @flow

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  const body = req.body ? JSON.stringify(req.body, null, 2) : '';
  logger.info(`${req.method} ${req.url} ${body}`);
  next();
});


//
// Routes
//

app.get('/', async (req, res) => {
  res.send('Welcome to the Project Gem Deployment Service!');
});

// Webhook for Website Image from Dockerhub
app.post('/website', async (req, res) => {

  push_data = req.body.push_data
  logger.info(push_data);

  res.send('New Website Image added to Dockerhub');

  exec('docker stack deploy --with-registry-auth  -c ../docker-compose.yml pg', (err, stdout, stderr) => {
    if (err) {
      logger.error(err)
      return;
    }

    logger.info(`stdout: ${stdout}`);
    logger.error(`stderr: ${stderr}`);
    });
});

// Webhook for Koh Image from Dockerhub
app.post('/koh', async (req, res) => {
  res.send('New Koh Image added to Dockerhub');
  push_data = req.body.push_data
  logger.info(push_data);

});

// Webhook for Server Image from Dockerhub
app.post('/server', async (req, res) => {
  res.send('New Server Image added to Dockerhub');
  push_data = req.body.push_data
  logger.info(push_data);
});



module.exports = app;
