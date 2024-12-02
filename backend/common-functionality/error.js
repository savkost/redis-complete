// Error Controller Functions

const AppError = require('./appError');

const handleDuplicateFieldsDB = err => {

  if (err.keyValue !== undefined && err.keyValue !== null){
    if (err.keyValue.name !== undefined && err.keyValue.name !== null){
      const message = `Duplicate field value: ${err.keyValue.name} . Please use another value.`;
      return new AppError(message, 400);
    }
  }

  const message = `Duplicate field value. Please use another value.`;
  return new AppError(message, 400);
};


const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Unathorized user.', 401);

const handleJWTExpiredError = () => new AppError('Expired token. Unathorized user.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  sendErrorDev(err, res);
}
