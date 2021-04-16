const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const AppError = require("./utils/appError.js");
const gloalErrorHandler = require("./controllers/errorController.js");
const tourRouter = require("./routes/tourRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const reviewRouter = require("./routes/reviewRoutes.js");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//--global middlewares--
app.use(express.static(path.join(__dirname, "public")));
//set security HTTP headers
app.use(helmet());

// Logging in dev
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour!",
});
app.use("/api", limiter);
//body parser => req.body

app.use(express.json({ limit: "10kb" }));
//data sanitization against NoSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//avoiding parameter polluting
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

//serving static files

// app.use((req, res, next) => {
//   console.log("hello from the middleware!");
//   next();
// });
//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//--mounting routes--
app.get("/", (req, res) => {
  res.status(200).render("base", { tour: "The Forest Hiker", user: "Gauri" });
});
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(gloalErrorHandler);
module.exports = app;
