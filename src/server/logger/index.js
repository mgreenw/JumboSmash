// @flow

const winston = require('winston');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

const myFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  }),
);

const logger = winston.createLogger({
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: myFormat,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: myFormat,
    }),
  ],
});


if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

module.exports = logger;

// On Development, we want see all output in the console
// On Production, we
