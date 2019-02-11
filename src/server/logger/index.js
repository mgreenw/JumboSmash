// @flow

const winston = require('winston');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

// Custom format that puts the timestamp before the message
const timestampError = winston.format.combine(
  winston.format.timestamp({ format: 'ddd M/D/YY h:mm:ssA' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf((info) => {
    if (info.stack) {
      // The substring here removes the duplicate "error" from the message
      return `${info.timestamp} ${info.level}: ${info.stack.substring(7)}`;
    }
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
      format: timestampError,
    }),
    new winston.transports.File({
      filename: 'combined.log',
      format: timestampError,
    }),
  ],
});

// Don't log to the console in production.
if (NODE_ENV !== 'production' && NODE_ENV !== 'testing') {
  logger.add(new winston.transports.Console({
    format: timestampError,
  }));
}

module.exports = logger;
