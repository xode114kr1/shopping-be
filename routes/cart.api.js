const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authController = require("../controllers/auth.controller");

router.get("/", authController.authenticate, cartController.getCart);
router.post("/", authController.authenticate, cartController.addItemToCart);
router.delete(
  "/:id",
  authController.authenticate,
  cartController.deleteItemToCart
);
router.post(
  "/:id",
  authController.authenticate,
  cartController.updateItemQtyInCart
);
router.get("/qty", authController.authenticate, cartController.getQty);
module.exports = router;
