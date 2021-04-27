const express = require("express");
const authenticationController = require("../controllers/authenticationController.js");
const router = express.Router();
const viewsController = require("./../controllers/viewsController.js");
const bookingController = require("./../controllers/bookingController.js");

router.use(viewsController.alerts);
router.get(
  "/",
  // bookingController.createBookingCheckout,
  authenticationController.isLoggedIn,
  viewsController.getOverview
);
router.get(
  "/tour/:tourSlug",
  authenticationController.isLoggedIn,
  viewsController.getTour
);
router.get(
  "/login",
  authenticationController.isLoggedIn,
  viewsController.getLoginForm
);
router.get("/me", authenticationController.protect, viewsController.getAccount);
// router.post(
//   "/submit-user-data",
//   authenticationController.protect,
//   viewsController.updateUserData
// );
router.get(
  "/my-tours",
  authenticationController.protect,
  viewsController.getMyTours
);
module.exports = router;
