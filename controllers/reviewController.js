const Review = require("./../models/reviewModel.js");
const catchAsync = require("./../utils/catchAsync.js");
exports.getAllReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Review.find();
  res.status(200).json({
    status: "success",
    results: allReviews.length,
    data: {
      reviews: allReviews,
    },
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});