const mongoose = require("mongoose");
const User = require("./User");
const Product = require("./Product");
const Schema = mongoose.Schema;

const cartSchema = Schema(
  // UserSchema 정의
  {
    userId: { type: mongoose.ObjectId, ref: User },
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.methods.toJSON = function () {
  // userSchema를 프론트로 보낼 때 데이터를 필터함
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  delete obj.createAt;
  return obj;
};

const Cart = mongoose.model("Cart", cartSchema); // userSchema를 모델로 추출
module.exports = Cart;
