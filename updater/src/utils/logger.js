import winston from 'winston';
const Log2gelf = require('winston-log2gelf');

const transports = [new winston.transports.Console()]

transports.push(
  new Log2gelf({
    hostname: 'kurki-updater',
    host: 'graylog-ingest.toska.cs.helsinki.fi',
    port: 9502,
    protocol: 'https',
    protocolOptions: {
      path:'/160543fe-1cc1-48df-affa-a30fb094823c/gelf'
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
