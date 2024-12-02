// AppError Class
// This class handles the errors globally

class AppError extends Error {
  constructor(message, statusCode){

    // Super
    super(message);

    // Set the proper fields
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4')? 'fail' : 'error';
    this.isOperational = true;

    // Not show the stacktrace. Uncomment to show the stacktrace
    this.stack = '';

    // Capture the stackTrace and don't show it in the error
    // Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
