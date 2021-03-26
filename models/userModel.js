const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "User must have an email."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Entry must be a valid email."],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Be sure to confirm your password."],
  },
});
const User = new mongoose.model("User", userSchema);
module.exports = User;
