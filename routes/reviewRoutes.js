const express = require("express");
const router = express.Router();
const reviewController = require("./../controllers/reviewController.js");
router.route("/getAllReviews").get(reviewController.getAllReviews);
router.route("/createReview").post(reviewController.createReview);
module.exports = router;
