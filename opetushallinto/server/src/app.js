import express from 'express';
import cors from 'cors';
import 'express-async-errors';

import verifyAdmin from './middlewares/verifyAdmin';
import currentUser from './middlewares/currentUser';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';

const app = express();

app.use(express.json())
app.use(cors());

app.use(currentUser);
app.use(verifyAdmin);

app.use(routes);

app.use(errorHandler);

export default app;
