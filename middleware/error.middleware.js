const {
  ApiError,
} = require("../utils/ApiError");

const errorHandler = (
  err,
  req,
  res,
  next
) => {


  let error = err;

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error",
      error.errors || [],
      error.stack
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(error.stack);
  }

  return res.status(error.statusCode).json({
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    data: null,
    errors: error.errors || [],
  });
};

module.exports = {
  errorHandler,
};