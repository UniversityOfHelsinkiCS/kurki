import kurkiUpdater from './utils/kurkiUpdater';
import logger from './utils/logger';

kurkiUpdater
  .updateCourseUnitsByCodes(['TKT20010'])
  .catch((error) => logger.error(error));
