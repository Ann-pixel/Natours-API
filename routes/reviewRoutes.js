const express = require("express");
const router = express.Router({ mergeParams: true });
const authenticationController = require("./../controllers/authenticationController.js");
const reviewController = require("./../controllers/reviewController.js");
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo("user"),
    reviewController.createReview
  );
module.exports = router;
