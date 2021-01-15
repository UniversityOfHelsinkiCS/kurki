import { AuthorizationError, ForbiddenError } from '../errors';
import isValidApiKey from '../utils/isValidApiKey';

const verifyApiKey = (req, res, next) => {
  const { apiKey } = req;

  if (!apiKey) {
    throw new AuthorizationError('Api key is not provided');
  }

  if (!isValidApiKey(apiKey)) {
    throw new ForbiddenError('Api key is invalid');
  }

  next();
};

export default verifyApiKey;
