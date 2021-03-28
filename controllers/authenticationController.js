const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError.js");
const User = require("./../models/userModel.js");
const catchAsync = require("./../utils/catchAsync.js");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password exists
  if (!email || !password) {
    return next(new AppError("Please provide an Email and Password", 400));
  }
  //check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  //send token if all of the above is okay.
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //get token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in. Please log in to get access", 401)
    );
  }
  //verification of the token
  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //check if user still exists.
  const currentUser = await User.findById(decodedPayload.id);
  if (!currentUser) {
    return next(
      new AppError("This user belonging to this token no longer exists"),
      401
    );
  }
  //check if user changed passwords after JWT was issued.
  if (currentUser.changedPasswordAfter(decodedPayload.iat)) {
    return next(
      new AppError(
        "User recently changed the password. Please log in again!",
        401
      )
    );
  }
  // grant access to protected route.
  req.user = currentUser;
  next();
});
