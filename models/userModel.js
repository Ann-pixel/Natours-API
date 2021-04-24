const mongoose = require("mongoose");
const crypto = require("crypto");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    default: "default.jpg",
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Be sure to confirm your password."],
    validate: {
      //custom validators always work only on SAVE and CREATE. not Update.
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same.",
    },
  },
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre(/^find/, function (next) {
  //this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre("save", async function (next) {
  //this middleware only runs if the pswd is modified.
  if (!this.isModified("password")) return next();
  // hash the pswd with  a cost of 12 (? number signifies CPU intensity)
  this.password = await bcrypt.hash(this.password, 12);
  //password confirm validation runs before this middleware, so we dont need it anymore and dont need to hash and save another field.
  //even though this is a required field. it is only required for input. not required to be persisted in the db
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  //subtract 1 second because sometimes, the doc is updated faster than the token is issued. making pswChangedAt > jwttimestamp. this ensures that doesnt happen
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchema.methods.changedPasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimestamp < changedTimestamp;
  }
  //false means NOT CHANGED after JWT was assigned
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  //saving encrypted in the Database and exposing only the decrypted to the client.
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = new mongoose.model("User", userSchema);
module.exports = User;
