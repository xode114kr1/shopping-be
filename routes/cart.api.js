const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authController = require("../controllers/auth.controller");

router.get("/", authController.authenticate, cartController.getCart);
router.post("/", authController.authenticate, cartController.addItemToCart);

module.exports = router;
