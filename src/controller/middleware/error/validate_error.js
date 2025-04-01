const Global = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  let parsedMessage;
  try {
    parsedMessage = JSON.parse(error.message);
  } catch (e) {
    parsedMessage = error.message;
  }

  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: parsedMessage,
    stack: error.stack,
    // stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

module.exports = Global;
