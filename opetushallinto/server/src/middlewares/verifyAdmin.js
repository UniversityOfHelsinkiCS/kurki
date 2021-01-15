import isAdminUser from '../utils/isAdminUser';
import { ForbiddenError, AuthorizationError } from '../errors';

const verifyAdmin = (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    throw new AuthorizationError('User is not authorized');
  }

  if (!isAdminUser(userId)) {
    throw new ForbiddenError('User does not have the required access rights');
  }

  next();
};

export default verifyAdmin;
