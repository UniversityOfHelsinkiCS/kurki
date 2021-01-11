import isAdminUser from '../utils/isAdminUser';
import { ForbiddenError } from '../errors';

const verifyAdmin = (req, res, next) => {
  if (!isAdminUser(req.userId)) {
    throw new ForbiddenError('User does not have required access rights');
  }

  next();
};

export default verifyAdmin;
