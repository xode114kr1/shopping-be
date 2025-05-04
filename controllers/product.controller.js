const Product = require("../models/Product");

const productController = {};
const PAGE_SIZE = 5;

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, image, category, description, stock, price, status } =
      req.body;
    console.log(req.body);
    const product = new Product({
      sku,
      name,
      image,
      category,
      description,
      stock,
      price,
      status,
    });
    await product.save();
    res.status(200).json({ status: "success", product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProducts = async (req, res) => {
  try {
    const { page, name } = req.query;
    const cond = name
      ? { name: { $regex: name, $options: "i" }, isDeleted: false }
      : { isDeleted: false };
    let query = Product.find(cond);
    let response = { status: "success" };

    if (page) {
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      const totalItemNum = await Product.countDocuments(cond);
      const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
      response.totalPageNum = totalPageNum;
    }

    const productList = await query.exec();
    response.data = productList;

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) throw new Error("fail find product");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.updateProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const { sku, name, image, price, description, category, stock, status } =
      req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        sku,
        name,
        image,
        price,
        description,
        category,
        stock,
        status,
      },
      { new: true }
    );
    if (!product) throw new Error("item doesn't exist");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

productController.deleteProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );
    if (!product) throw new Error("fail delect Product");
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

const groupByProductId = (itemList) => {
  const grouped = {};
  for (const item of itemList) {
    const pid = item.productId;
    if (!grouped[pid]) grouped[pid] = [];
    grouped[pid].push(item);
  }
  return grouped;
};

productController.checkItemListStock = async (itemList) => {
  const insufficientStockItems = [];
  const groupedItems = groupByProductId(itemList);

  for (const productId in groupedItems) {
    const items = groupedItems[productId];
    const product = await Product.findById(productId);
    if (!product) {
      insufficientStockItems.push({
        item: { productId },
        message: "상품이 존재하지 않습니다",
      });
      continue;
    }

    const newStock = { ...product.stock };
    for (const item of items) {
      const size = item.size;
      const qty = item.qty;

      if (!newStock[size] || newStock[size] < qty) {
        insufficientStockItems.push({
          item,
          message: `${product.name}의 ${size} 재고가 부족합니다`,
        });
        continue;
      }
      newStock[size] -= qty;
    }

    if (
      !insufficientStockItems.some(
        (entry) => entry.item.productId === productId
      )
    ) {
      product.stock = newStock;
      await product.save();
    }
  }

  return insufficientStockItems;
};

module.exports = productController;
