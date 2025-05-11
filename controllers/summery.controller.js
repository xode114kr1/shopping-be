const Summary = require("../models/Summary");

const summaryController = {};

summaryController.getSummary = async (req, res) => {
  try {
    let summary = await Summary.findOne();
    if (!summary) {
      summary = new Summary({
        totalOrders: 0,
        totalRevenue: 0,
        totalUnitsSold: 0,
        averageOrderValue: 0,
      });
      await summary.save();
    }
    res.status(200).json({ status: "success", summary: summary });
  } catch (error) {
    res.status(400).json({ status: "fail", error: error.message });
  }
};

module.exports = summaryController;
