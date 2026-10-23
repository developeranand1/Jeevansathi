const successResponse = (res, message = 'OK', data = {}, meta = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
  };
  if (meta) {
    response.meta = meta;
  }
  return res.status(statusCode).json(response);
};

const errorResponse = (res, message = 'Internal Server Error', errorCode = 'SERVER_ERROR', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    error_code: errorCode,
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
