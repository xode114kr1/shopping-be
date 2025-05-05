const express = require("express");
const autoController = require("../controllers/auth.controller");
const orderController = require("../controllers/order.controller");
const router = express.Router();

router.post("/", autoController.authenticate, orderController.createOrder);
router.get("/me", autoController.authenticate, orderController.getOrder);
router.get(
  "/",
  autoController.authenticate,
  autoController.checkAdminPermission,
  orderController.getOrderList
);
router.put(
  "/:id",
  autoController.authenticate,
  autoController.checkAdminPermission,
  orderController.updateOrder
);
module.exports = router;
