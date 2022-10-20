const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //if the user doesnot specify the status code then use 500 as default

  // we show all ditailed error information to the developer if we are on dev mode
  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack, //Complete error stack
    });
  }
  //   we don't show all ditailed error informations to user if we are on prod mode
  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    //Wrong Mongoose Obj Id Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid ${err.path} `;
      error = new ErrorHandler(message, 404);
    }
    // Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
      //If we have multiple error due to many required elements are missing
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }
    //Handle mongoose duplicate key error, this error happened if we try to recreate an existing user email
    //These key values are coming from postmen error message object=> err.keyValue is the email we try to enter twice
    if (error.code === 11000) {
      const message = `duplicate ${Object.keys(err.keyValue)} entered.`;
      error = new ErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
