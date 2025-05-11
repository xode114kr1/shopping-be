const express = require("express");
const autoController = require("../controllers/auth.controller");
const summaryController = require("../controllers/summery.controller");
const router = express.Router();

router.get(
  "/",
  autoController.authenticate,
  autoController.checkAdminPermission,
  summaryController.getSummary
);

module.exports = router;
