const express = require("express");
const userApi = require("./user.api");
const authApi = require("./auth.api");
const router = express.Router();

router.use("/user", userApi);
router.use("/auth", authApi);

module.exports = router;
