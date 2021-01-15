const parseApiKey = (req, res, next) => {
  const { headers, query } = req;

  const apiKey = headers['x-api-key'] || query.apiKey;

  req.apiKey = apiKey;

  next();
};

export default parseApiKey;
