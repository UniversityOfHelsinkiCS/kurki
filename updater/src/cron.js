import cron from 'node-cron';

import { COURSES_UPDATE_CRON, CS_BACHELOR_PROGRAMME_CODE } from './config';
import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';

const startCronJobs = () => {
  cron.schedule(COURSES_UPDATE_CRON, async () => {
    logger.info('Starting courses update cron job');

    await kurkiUpdater
      .updateCourseUnitsByProgamme(CS_BACHELOR_PROGRAMME_CODE)
      .catch((error) => logger.error(error));

    logger.info('Finished courses update cron job');
  });
};

export default startCronJobs;
