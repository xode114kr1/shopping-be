const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Error("User already exist");
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      password: hashPassword,
      name,
      level: level ? level : "customer",
    });
    await newUser.save();
    return res.status(200).json({ status: "success create user" });
  } catch (error) {
    res.status(400).json({ status: "fail create user", error: error.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user) {
      return res.status(200).json({ status: "success getuser", user });
    }
    throw new Error("invalid token");
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
};

module.exports = userController;
