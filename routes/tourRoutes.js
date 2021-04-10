const express = require("express");
const router = express.Router();
const reviewRouter = require("./reviewRoutes.js");
const tourController = require("./../controllers/tourController.js");
const authenticationController = require("./../controllers/authenticationController.js");

// router
//   .route("/:tourId/reviews")
//   .post(
//     authenticationController.protect,
//     authenticationController.restrictTo("user"),
//     reviewController.createReview
//   );
router.use("/:tourId/reviews", reviewRouter);

// router.param("id", tourController.checkID);
router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
router
  .route("/")
  .get(authenticationController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
