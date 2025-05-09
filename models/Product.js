const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema(
  // UserSchema 정의
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Array, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Object, require: true },
    status: { type: String, default: "active" },
    isDeleted: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.methods.toJSON = function () {
  // userSchema를 프론트로 보낼 때 데이터를 필터함
  const obj = this._doc;
  delete obj.__v;
  delete obj.updateAt;
  delete obj.createAt;
  return obj;
};

const Product = mongoose.model("Product", ProductSchema); // userSchema를 모델로 추출
module.exports = Product;
