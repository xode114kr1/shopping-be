const Cart = require("../models/Cart");
const User = require("../models/User");

const cartController = {};

cartController.addItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const { productId, size, qty } = req.body;
    // 유저를 가지로 카트 찾기 (없다면? 만들어주기)
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId });
      await cart.save();
    }

    // 이미 카트에 들어가 있다면? 에러
    const existItem = cart.items.find(
      (item) => item.productId.equals(productId) && item.size === size
    );
    if (existItem) throw new Error("existed item");

    // 카트에 아이템 추가
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    res
      .status(200)
      .json({ status: "success", data: cart, cartItemQty: cart.items.length });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    console.log(cart);
    res.status(200).json({ status: "success", data: cart.items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.deleteItemToCart = async (req, res) => {
  try {
    const { userId } = req;
    const id = req.params.id;
    let cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });
    if (!cart) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart not found" });
    }
    cart.items = cart.items.filter((item) => !item._id.equals(id));
    await cart.save();

    res.status(200).json({ status: "success", data: cart.items });
  } catch (error) {
    res.state(400).json({ status: "fail", error: error.message });
  }
};

cartController.updateItemQtyInCart = async (req, res) => {
  try {
    const { userId } = req;
    const { qty } = req.body;
    const { id } = req.params;
    let cart = await Cart.findOne({ userId }).populate({
      path: "items",
      populate: {
        path: "productId",
        model: "Product",
      },
    });

    if (!cart) {
      return res.state(404).json({ status: "fail", message: "Cart not found" });
    }

    const item = cart.items.find((item) => item._id.equals(id));
    if (!item) {
      return res
        .state(404)
        .json({ status: "fail", message: "Item not found in cart" });
    }
    item.qty = qty;
    await cart.save();
    res.status(200).json({ status: "success", data: cart.items });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

cartController.getQty = async (req, res) => {
  try {
    const { userId } = req;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ status: "fail", error: "Cart not found" });
    }

    const qty = cart.items.length;
    res.status(200).json({ status: "succuss", data: qty });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};
module.exports = cartController;
