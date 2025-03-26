const mongoose = require("mongoose");
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
  delete obj.updateAt;
  delete obj.createAt;
  return obj;
};

const User = mongoose.model("User", userSchema); // userSchema를 모델로 추출
module.exports = User;
