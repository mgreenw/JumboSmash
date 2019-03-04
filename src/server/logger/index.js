// @flow

const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const config = require('config');

const { version } = require('../package.json');

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
  defaultMeta: { NODE_ENV },
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
  ],
});

if (NODE_ENV === 'production') {
  const google = config.get('google');
  const googleCloud = new LoggingWinston({
    projectId: google.project_id,
    credentials: {
      client_email: google.client_email,
      private_key: google.private_key,
    },
    serviceContext: {
      service: 'projectgem-server',
      version,
    },
  });

  logger.add(googleCloud);
}

// Don't log to the console in production.
if (NODE_ENV !== 'production' && NODE_ENV !== 'test') {
  logger.add(new winston.transports.Console({
    format: timestampError,
  }));
  logger.add(new winston.transports.File({
    filename: 'combined.log',
    format: timestampError,
  }));
}

module.exports = logger;
