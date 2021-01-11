import winston from 'winston';

const transports = [new winston.transports.Console()]

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
