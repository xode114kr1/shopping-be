const bcrypt = require("bcryptjs");
const User = require("../models/User");
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

module.exports = autoController;
