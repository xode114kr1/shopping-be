const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const autoController = {};

autoController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();
        return res.status(200).json({ status: "success login", user, token });
      }
    }
    throw new Error("invalid email or password");
  } catch (error) {
    res.status(400).json({ status: "fail login", error: error.message });
  }
};

autoController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error("Token not found");
    const token = tokenString.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
      if (error) throw new Error("invalid token");
      req.userId = payload._id;
    });
    next();
  } catch (error) {
    res
      .status(400)
      .json({ status: "fail token with login", error: error.message });
  }
};

module.exports = autoController;
