// @flow

const express = require('express');
const config = require('config');
//const secrets = require('./secrets');

const bodyParser = require('body-parser');
const logger = require('./logger');
const { exec } = require('child_process');

const username = config.get('DOCKER_USERNAME');
const password = config.get('DOCKER_PASSWORD');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  const body = req.body ? JSON.stringify(req.body, null, 2) : '';
  logger.info(`${req.method} ${req.url} ${body}`);
  next();
});

// Login to the docker daemon with credentials
exec('echo ' + password + ' | docker login --username ' + username + ' --password-stdin', (err, stdout, stderr) => {
    logger.info("Logging In!");
    if (err) {
      logger.error(err)
      return;
    }
   logger.info(`${stdout}`);
   logger.error(`${stderr}`);
});



//
// Routes
//

app.get('/', async (req, res) => {
  res.send('Welcome to the Project Gem Deployment Service!');
});

// Webhook for Website Image from Dockerhub
app.post('/website', async (req, res) => {

  logger.info(req.body.push_data);

  // TODO CLEAN THIS UP/MODULARIZE/

  // First Try to Pull the Most Recent Version from DockerHub
  exec('docker pull sperrys/website:latest', (err, stdout, stderr) => {
      logger.info("Pulling Website!");
      if (err) {
        logger.error(err)
        return;
      }
     logger.info(`${stdout}`);
     logger.error(`${stderr}`);

    // Then try to bring down the arthur service
    exec('docker service rm pg_arthur', (err, stdout, stderr) => {
         logger.info("Bringing Down Arthur!");
         if (err) {
           logger.error(err)
           return;
         }
        logger.info(`${stdout}`);
        logger.error(`${stderr}`);

       // Update the docker stack with the new version of arthur (this command only updates services that change)
       exec('docker stack deploy --with-registry-auth  -c docker-compose.yml pg', (err, stdout, stderr) => {
           logger.info("Updating Arthur!");
           if (err) {
             logger.error(err)
             return;
           }
          logger.info(`${stdout}`);
          logger.error(`${stderr}`);
        });
      });
  });
    res.send('New Website Image added to Dockerhub');
});

// Webhook for Koh Image from Dockerhub
app.post('/koh', async (req, res) => {
  logger.info(req.body.push_data);
  res.send('New Koh Image added to Dockerhub');

});

// Webhook for Server Image from Dockerhub
app.post('/server', async (req, res) => {
  res.send('New Server Image added to Dockerhub');
  logger.info(req.body.push_data);
});



module.exports = app;
