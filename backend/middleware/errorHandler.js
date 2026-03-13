export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    status = 400;
    message = `Duplicate field: ${Object.keys(err.keyValue)[0]}`;
  }

  res.status(status).json({
    success: false,
    error: message,
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};