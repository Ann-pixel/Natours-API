const express = require("express");
const authenticationController = require("../controllers/authenticationController.js");
const router = express.Router();
const viewsController = require("./../controllers/viewsController.js");

router.get(
  "/",
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
module.exports = router;
