const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}:  ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use a unique value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handleJWTError = (err) => {
  return new AppError("Invalid token. Please login again", 401);
};
const handleJWTExpiredError = (err) => {
  return new AppError("Your token has expired. Please login again.", 401);
};
const sendErrorForDev = (err, req, res) => {
  //API

  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //Rendered Website
  console.error("Error 🎃", err);

  return res
    .status(err.statusCode)
    .render("error", { title: "Something went wrong", message: err.message });
};
const sendErrorForProd = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    //A: API
    //Operational error. so send full info to client

    if (err.isOperational) {
      //opearational- trusted error
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming/application error. dont want  to leak errs to client.instead- log them--
    console.error("Error 🎃", err);
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
  //B rendered website
  if (err.isOperational) {
    //opearational- trusted error

    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      message: err.message,
    });
  }
  //Programming/application error. dont want  to leak errs to client.instead- log them--
  console.error("Error 🎃", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    message: "Please try again later.",
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError(error);
    }
    sendErrorForProd(error, req, res);
  }
};
