const express = require("express");
const authenticationController = require("./../controllers/authenticationController.js");
const bookingController = require("./../controllers/bookingController.js");

const router = express.Router();

router.use(authenticationController.protect);
router.get("/checkout-session/:tourId", bookingController.getCheckOutSession);
router.use(authenticationController.restrictTo("admin", "lead-guide"));
router
  .route("/")
  .get(bookingController.getAllBooking)
  .post(bookingController.createBooking);
router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);
module.exports = router;
