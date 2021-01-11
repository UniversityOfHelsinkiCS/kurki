const currentUser = (req, res, next) => {
  // TODO: Shibbo
  // req.userId = req.headers.uid;
  req.userId = 'kalleilv';

  next();
};

export default currentUser;
