const express = require("express");
const router = express.Router({ mergeParams: true });
const authenticationController = require("./../controllers/authenticationController.js");
const reviewController = require("./../controllers/reviewController.js");

router.use(authenticationController.protect);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authenticationController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authenticationController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );
module.exports = router;
