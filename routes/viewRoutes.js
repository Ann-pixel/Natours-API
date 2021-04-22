const express = require("express");
const authenticationController = require("../controllers/authenticationController.js");
const router = express.Router();
const viewsController = require("./../controllers/viewsController.js");
router.use(authenticationController.isLoggedIn);
router.get("/", viewsController.getOverview);
router.get("/tour/:tourSlug", viewsController.getTour);
router.get("/login", viewsController.getLoginForm);
module.exports = router;
