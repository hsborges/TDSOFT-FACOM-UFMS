const clientIdentificator = (req, res, next) => {
  if (!req.headers["client-id"])
    return res.status(401).send("Client ID is required");
  req.clientId = req.headers["client-id"];
  next();
};

export default clientIdentificator;
