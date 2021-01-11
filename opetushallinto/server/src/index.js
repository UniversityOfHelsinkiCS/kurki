import app from './app';

import { PORT } from './config';
import logger from './utils/logger';

app.listen(PORT, () => {
  logger.info(`Server is listening to port ${PORT}`);
});
