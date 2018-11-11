// @flow

const winston = require('winston');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

// Custom format that puts the timestamp before the message
const simpleTimestamp = winston.format.combine(
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
      format: simpleTimestamp,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: simpleTimestamp,
    }),
  ],
});

// Don't log to the console in production.
if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
  }));
}

module.exports = logger;
