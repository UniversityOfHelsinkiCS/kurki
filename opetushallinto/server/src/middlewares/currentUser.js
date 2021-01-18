const currentUser = (req, res, next) => {
  console.log(req.headers);

  req.userId = req.headers.uid;

  next();
};

export default currentUser;
