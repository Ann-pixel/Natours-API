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
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
module.exports = router;
