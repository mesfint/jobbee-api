/*
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
*/

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //if the user doesnot specify the status code then use 500 as default
  // we show all ditailed error information to the developer if we are on dev mode

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }
  //   we don't show all ditailed error informations to user if we are on prod mode
  if (process.env.NODE_ENV === "production ") {
    let error = { ...err };

    error.message = err.message;

    // Wrong Mongoose Object ID Error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    // Handling Mongoose Validation Error
    if (err.name === "ValidationError") {
      //If we have multiple error due to many required elements are missing
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handle mongoose duplicate key error
    //Handle mongoose duplicate key error, this error happened if we try to recreate an existing user email
    //These key values are coming from postman error message object=> err.keyValue is the email we try to enter twice
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Wrong JWT token error
    if (err.name === "JsonWebTokenError") {
      const message = "JSON Web token is invalid. Try Again!";
      error = new ErrorHandler(message, 500);
    }

    // Handling Expired JWT token error
    if (err.name === "TokenExpiredError") {
      const message = "JSON Web token is expired. Try Again!";
      error = new ErrorHandler(message, 500);
    }

    res.status(error.statusCode).json({
      success: false,
      message: error.message || "Internal Server Error.",
    });
  }
};
