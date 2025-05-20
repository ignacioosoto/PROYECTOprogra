const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../auth/generateTokens");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("./token");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  faceImage: { type: String }, // base64 de imagen
});

userSchema.pre("save", function (next) {
  if (this.isModified("password") || this.isNew) {
    bcrypt.hash(this.password, 10, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.usernameExist = async function (username) {
  const result = await mongoose.model("User").findOne({ username });
  return !!result;
};

userSchema.methods.comparePassword = async function (password, hash) {
  return await bcrypt.compare(password, hash);
};

userSchema.methods.createAccessToken = function () {
  return generateAccessToken(getUserInfo(this));
};

userSchema.methods.createRefreshToken = async function () {
  const refreshToken = generateRefreshToken(getUserInfo(this));
  await new Token({ token: refreshToken }).save();
  return refreshToken;
};

module.exports = mongoose.model("User", userSchema);
