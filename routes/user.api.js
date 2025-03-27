const express = require("express");
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");
const router = express.Router();

router.post("/", userController.createUser);
router.get("/me", authController.authenticate, userController.getUser); // 토큰이 valid인지, token을 가지고 user를 찾아서 return

module.exports = router;
