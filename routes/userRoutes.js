const express = require("express");
const app = express();
const userController = require("./../controllers/userController.js");
const authenticationController = require("./../controllers/authenticationController.js");
const router = express.Router();
router.post("/signup", authenticationController.signUp);
router.post("/login", authenticationController.logIn);
router.post("/forgotPassword", authenticationController.forgotPassword);
router.patch("/resetPassword/:token", authenticationController.resetPassword);
router.patch(
  "/updateMyPassword",
  authenticationController.protect,
  authenticationController.updatePasswords
);
router.get(
  "/me",
  authenticationController.protect,
  userController.getMe,
  userController.getUser
);
router.patch(
  "/updateMe",
  authenticationController.protect,
  userController.updateMe
);
router.delete(
  "/deleteMe",
  authenticationController.protect,
  userController.deleteMe
);

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
