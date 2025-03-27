const express = require("express");
const userApi = require("./user.api");
const authApi = require("./auth.api");
const productApi = require("./product.api");
const router = express.Router();

router.use("/user", userApi);
router.use("/auth", authApi);
router.use("/product", productApi);

module.exports = router;
