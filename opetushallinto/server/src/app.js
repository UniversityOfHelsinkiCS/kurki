import express from 'express';
import 'express-async-errors';

import verifyAdmin from './middlewares/verifyAdmin';
import currentUser from './middlewares/currentUser';
import errorHandler from './middlewares/errorHandler';
import api from './routes/api';

import {
  IS_PRODUCTION,
  CLIENT_BUILD_PATH,
  CLIENT_BUILD_INDEX_PATH,
} from './config';

const app = express();

app.use(currentUser);
app.use(verifyAdmin);

app.use('/api', api);

if (IS_PRODUCTION) {
  app.use(express.static(CLIENT_BUILD_PATH));
  app.get('*', (req, res) => res.sendFile(CLIENT_BUILD_INDEX_PATH));
}

app.use(errorHandler);

export default app;
