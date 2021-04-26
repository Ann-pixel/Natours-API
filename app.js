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
const viewRouter = require("./routes/viewRoutes.js");
const bookingRouter = require("./routes/bookingRoutes.js");
const bookingController = require("./controllers/bookingController.js");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cors = require("cors");
const app = express();
app.enable("trust proxy");
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//--global middlewares--
app.use(express.static(path.join(__dirname, "public")));
//set security HTTP headers
// app.use(helmet());

app.use(cors());
// app.use(
//   cors({
//     origin: "http://127.0.0.1:3000",
//     credentials: true,
//   })
// );
app.options("*", cors());
//--------------------------------- resolving content security policy issues
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'", "https:", "http:", "data:", "ws:"],
//       baseUri: ["'self'"],
//       fontSrc: ["'self'", "https:", "http:", "data:"],
//       scriptSrc: ["'self'", "https:", "http:", "blob:"],
//       styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
//     },
//   })
// );
// app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: [
          "'self'",
          "https:",
          "http:",
          "blob:",
          "https://*.mapbox.com",
          "https://js.stripe.com",
          "https://m.stripe.network",
          "https://*.cloudflare.com",
        ],
        frameSrc: ["'self'", "https://js.stripe.com"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://*.tiles.mapbox.com",
          "https://api.mapbox.com",
          "https://events.mapbox.com",
          "https://m.stripe.network",
        ],
        childSrc: ["'self'", "blob:"],
        imgSrc: ["'self'", "data:", "blob:"],
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          // "unsafe-inline",
          "data:",
          "blob:",
          "https://*.stripe.com",
          "https://*.mapbox.com",
          "https://*.cloudflare.com/",
          "https://bundle.js:*",
          "ws://127.0.0.1:*/",
        ],
        upgradeInsecureRequests: true,
      },
    },
  })
);

//--------------------------------- resolving content security policy issues
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
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  bookingController.webHookCheckout
);
//body parser => req.body

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
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

app.use(compression());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

//--mounting routes--

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/booking", bookingRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});
app.use(gloalErrorHandler);
module.exports = app;
