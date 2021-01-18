import Transport from 'winston-transport';

import opetushallintoClient from '../opetushallintoClient';

export class OpetushallintoTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    const { message, level, timestamp } = info;

    const body = { message, level, timestamp };

    opetushallintoClient
      .post('/updater/logs', body)
      .then(() => {
        callback();
      })
      .catch((error) => {
        console.error('Failed to transport logs to opetushallinto server');
        console.error(error);
        callback();
      });
  }
}

export default new OpetushallintoTransport({
  level: 'error',
});
