const express = require("express");
const morgan = require("morgan");
const e = require("express");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const app = express();

//--middlewares--
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// app.use((req, res, next) => {
//   console.log("hello from the middleware!");
//   next();
// });
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//--mounting routes--
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server.`,
  });
});
module.exports = app;
