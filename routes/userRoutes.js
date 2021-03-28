const express = require("express");
const app = express();
const userController = require("./../controllers/userController.js");
const authenticationController = require("./../controllers/authenticationController.js");
const router = express.Router();

router.post("/signup", authenticationController.signUp);
router.post("/login", authenticationController.logIn);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
