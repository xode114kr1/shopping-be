const express = require("express");
const userApi = require("./userApi");
const router = express.Router();

router.use("/user", userApi);

module.exports = router;
