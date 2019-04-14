// @flow

const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');
const config = require('config');
const fs = require('fs');

const { version } = require('../package.json');

const utils = require('../utils');

const NODE_ENV = utils.getNodeEnv();

const LOG_DIR = 'logs';
const LOG_ENV_DIR = `${LOG_DIR}/${NODE_ENV}`;

// Make the log directory if needed
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
  if (!fs.existsSync(LOG_ENV_DIR)) {
    fs.mkdirSync(LOG_ENV_DIR);
  }
}

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

const httpRequestJson = winston.format.combine(
  winston.format((info) => {
    if (!info.httpRequest) return false;
    return info;
  })(),
  winston.format.timestamp({ format: 'ddd M/D/YY h:mm:ssA' }),
  winston.format.json(),
);

const logger = winston.createLogger({
  defaultMeta: { NODE_ENV },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: `${LOG_ENV_DIR}/error.log`,
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
} else {
  logger.add(new winston.transports.File({
    filename: `${LOG_ENV_DIR}/http-requests.log`,
    level: 'info',
    format: httpRequestJson,
  }));
}

// Don't log info to the console in production, test, or travis
if (NODE_ENV !== 'production' && NODE_ENV !== 'test' && NODE_ENV !== 'travis') {
  logger.add(new winston.transports.Console({
    level: 'silly',
    format: timestampError,
  }));
  logger.add(new winston.transports.File({
    filename: `${LOG_ENV_DIR}/combined.log`,
    format: timestampError,
  }));
}

// Log console warn to test and travis!
if (NODE_ENV === 'test' || NODE_ENV === 'travis') {
  logger.add(new winston.transports.Console({
    level: 'warn',
    format: timestampError,
  }));
}

module.exports = logger;
