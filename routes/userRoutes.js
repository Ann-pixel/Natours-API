const express = require("express");
const app = express();
const userController = require("./../controllers/userController.js");
const authenticationController = require("./../controllers/authenticationController.js");
const router = express.Router();
router.post("/signup", authenticationController.signUp);
router.post("/login", authenticationController.logIn);
router.get("/logout", authenticationController.logout);
router.post("/forgotPassword", authenticationController.forgotPassword);
router.patch("/resetPassword/:token", authenticationController.resetPassword);

router.use(authenticationController.protect);
router.patch("/updateMyPassword", authenticationController.updatePasswords);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.use(authenticationController.restrictTo("admin"));
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
