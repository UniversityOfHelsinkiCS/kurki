import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import currentUser from './middlewares/currentUser';
import parseApiKey from './middlewares/parseApiKey';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import { IS_DEVELOPMENT } from './config';

const app = express();

app.use(express.json());

if (IS_DEVELOPMENT) {
  app.use(cors());
}

app.use(currentUser);
app.use(parseApiKey);

app.use(routes);

app.use(errorHandler);

export default app;
