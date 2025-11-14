const errorHandler = (err, req, res, next) => {
  res.status(500).json({
    err,
    message: err.message
  });
};

export default errorHandler;
