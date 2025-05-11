const Summary = require("../models/Summary");

const updateSummary = async ({ totalPrice, orderList }) => {
  const totalUnits = orderList.reduce((sum, item) => sum + item.qty, 0);

  let summary = await Summary.findOne();
  if (!summary) {
    summary = new Summary();
  }
  const newTotalOrders = summary.totalOrders + 1;
  const newTotalRevenue = summary.totalRevenue + totalPrice;
  const newTotalUnitsSold = summary.totalUnitsSold + totalUnits;
  const newAverageOrderValue = newTotalRevenue / newTotalOrders;

  // 3. 업데이트 적용
  await Summary.updateOne(
    {},
    {
      $set: {
        totalOrders: newTotalOrders,
        totalRevenue: newTotalRevenue,
        totalUnitsSold: newTotalUnitsSold,
        averageOrderValue: newAverageOrderValue,
      },
    },
    { upsert: true }
  );
};

module.exports = { updateSummary };
