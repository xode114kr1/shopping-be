const Order = require("../models/Order");
const { updateSummary } = require("../services/summaryService");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const productController = require("./product.controller");

const PAGE_SIZE = 10;

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { shipTo, contact, totalPrice, orderList } = req.body;

    const insufficientStockItems = await productController.checkItemListStock(
      orderList
    );

    if (insufficientStockItems.length > 0) {
      const errorMessage = insufficientStockItems.reduce(
        (total, item) => (total += item.message),
        ""
      );
      throw new Error(errorMessage);
    }

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      items: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    await updateSummary({ totalPrice, orderList });

    res.status(200).json({ status: "success", orderNum: newOrder.orderNum });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrder = async (req, res) => {
  try {
    const { userId } = req;
    const order = await Order.find({ userId }).populate("items.productId");
    res.status(200).json({ status: "succes", orderList: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.getOrderList = async (req, res) => {
  try {
    const { page, ordernum } = req.query;

    // 조건 구성: ordernum이 있으면 필터링, 없으면 전체 조회
    const cond = ordernum
      ? { orderNum: { $regex: ordernum, $options: "i" } }
      : {};

    let query = Order.find(cond).populate("items.productId").populate("userId");
    const response = { status: "success" };

    // 페이지네이션 처리
    if (page) {
      query = query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Order.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const orderList = await query.exec();
    response.orderList = orderList;

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

orderController.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    let order = await Order.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );
    if (!order) throw new Error("Can't find order");

    res.status(200).json({ status: "success", order: order });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = orderController;
