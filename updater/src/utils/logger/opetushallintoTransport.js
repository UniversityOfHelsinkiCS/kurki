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
      .then(({ data }) => {
        callback(null, data);
      })
      .catch((error) => {
        callback(error);
      });
  }
}

export default new OpetushallintoTransport({
  level: 'error',
});
