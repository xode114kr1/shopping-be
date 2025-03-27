const express = require("express");
const autoController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", autoController.loginWithEmail);

module.exports = router;
