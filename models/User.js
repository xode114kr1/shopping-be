const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const Schema = mongoose.Schema;

const userSchema = Schema(
  // UserSchema 정의
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, default: "customer" }, // 2type : customer, admin
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  // userSchema를 프론트로 보낼 때 데이터를 필터함
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.updatedAt;
  delete obj.createdAt;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};

const User = mongoose.model("User", userSchema); // userSchema를 모델로 추출
module.exports = User;
