const express = require("express");
const autoController = require("../controllers/auth.controller");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.post("/", autoController.authenticate, orderController.createOrder);

module.exports = router;
