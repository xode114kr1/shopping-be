const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SummarySchema = Schema({
  totalOrders: { type: Number, default: 0, required: true },
  totalRevenue: { type: Number, default: 0, required: true },
  totalUnitsSold: { type: Number, default: 0, required: true },
  averageOrderValue: { type: Number, default: 0 },
});

SummarySchema.methods.toJSON = function () {
  // userSchema를 프론트로 보낼 때 데이터를 필터함
  const obj = this._doc;
  delete obj._id;
  delete obj.__v;
  return obj;
};

const Summary = mongoose.model("Summary", SummarySchema);
module.exports = Summary;
