import winston from 'winston';
const Log2gelf = require('winston-log2gelf');

const transports = [new winston.transports.Console()]

transports.push(
  new Log2gelf({
    hostname: 'kurki-updater',
    host: process.env.LOG_HOST || 'localhost',
    port: process.env.LOG_PORT || 9502,
    protocol: 'https',
    protocolOptions: {
      path: process.env.LOG_PATH || '/gelf'
    }
  })
)


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports
});

export default logger;
