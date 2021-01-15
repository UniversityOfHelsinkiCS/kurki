const currentUser = (req, res, next) => {
  req.userId = req.headers.uid;

  next();
};

export default currentUser;
