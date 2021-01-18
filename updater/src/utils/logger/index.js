import winston from 'winston';
import Log2gelf from 'winston-log2gelf';

import opetushallintoTransport from './opetushallintoTransport';
import { SEND_REPORTS } from '../../config';

const log2gelfTransport = new Log2gelf({
  hostname: 'kurki-updater',
  host: process.env.LOG_HOST || 'localhost',
  port: process.env.LOG_PORT || 9502,
  protocol: 'https',
  protocolOptions: {
    path: process.env.LOG_PATH || '/gelf',
  },
});

const transports = [
  new winston.transports.Console(),
  log2gelfTransport,
  SEND_REPORTS && opetushallintoTransport,
].filter(Boolean);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports,
});

export default logger;
