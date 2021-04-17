const express = require("express");
const router = express.Router();
const viewsController = require("./../controllers/viewsController.js");

router.get("/", viewsController.getOverview);
router.get("/tour", viewsController.getTour);
module.exports = router;
