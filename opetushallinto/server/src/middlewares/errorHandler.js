import logger from '../utils/logger';
import { ApplicationError } from '../errors';

const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const publicError =
    err instanceof ApplicationError
      ? err
      : new ApplicationError('Something went wrong');

  res.status(publicError.status);
  res.send(publicError.toJSON());

  next();
};

export default errorHandler;
