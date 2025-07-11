import fs from 'fs';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const shouldLog = process.env.NODE_ENV === 'production';

let logger;

if (shouldLog) {
  let transport = null;
  let isTransportInitialized = false;

  const initializeTransport = () => {
    if (!isTransportInitialized) {
      transport = new DailyRotateFile({
        filename: '%DATE%.log', // Will become "10-07-2025.log"
        dirname: logDir,
        datePattern: 'DD-MM-YYYY', // Custom filename format
        level: 'error', // Only log errors
        zippedArchive: false, // You can set to true to zip old logs
        maxSize: '20m', // Optional: split if too big
        maxFiles: '30d', // Keep logs for 30 days
        createSymlink: false, // Don't create latest.log symlink
      });

      // Winston logger config
      logger = winston.createLogger({
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
          })
        ),
        transports: [transport],
        exitOnError: false,
      });

      isTransportInitialized = true;
    }
  };

  // Create a proxy logger that initializes transport only when needed
  logger = {
    error: message => {
      initializeTransport();
      logger.error(message);
    },
    warn: message => {
      initializeTransport();
      logger.warn(message);
    },
    info: message => {
      initializeTransport();
      logger.info(message);
    },
    debug: message => {
      initializeTransport();
      logger.debug(message);
    },
  };
} else {
  // Dev: Just log to console and also to file for debugging
  logger = {
    error: message => {
      console.error('Error:', message);
    },
    warn: message => {
      console.warn('Warning:', message);
    },
    info: message => {
      console.info('Info:', message);
    },
    debug: message => {
      console.debug('Debug:', message);
    },
  };
}

export default logger;
