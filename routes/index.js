const express = require("express");
const userApi = require("./user.api");
const authApi = require("./auth.api");
const cartApi = require("./cart.api");
const orderApi = require("./order.api");
const productApi = require("./product.api");
const summaryApi = require("./summery.api");
const router = express.Router();

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);
router.use("/cart", cartApi);
router.use("/order", orderApi);
router.use("/summary", summaryApi);

module.exports = router;
