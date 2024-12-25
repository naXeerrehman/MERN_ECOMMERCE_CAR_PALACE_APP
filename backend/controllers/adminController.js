import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
  try {
    // Count the orders with specific statuses
    const placed = await Order.countDocuments({ status: "Placed" });
    const shipped = await Order.countDocuments({ status: "Shipped" });
    const delivered = await Order.countDocuments({ status: "Delivered" });
    const processing = await Order.countDocuments({ status: "Processing" });
    const completed = await Order.countDocuments({ status: "Completed" });

    // Aggregation for total earnings
    const totalEarnings = await Order.aggregate([
      { $match: { amount: { $exists: true, $ne: null, $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Aggregation for total products sold
    const totalProductsSold = await Order.aggregate([
      { $match: { productsCount: { $exists: true, $ne: null, $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$productsCount" } } },
    ]);

    // Count total number of orders
    const totalOrders = await Order.countDocuments();

    // Return the stats
    res.json({
      placed,
      shipped,
      delivered,
      processing,
      completed,
      totalEarnings: totalEarnings[0]?.total || 0,
      totalProductsSold: totalProductsSold[0]?.total || 0,
      totalOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching admin stats" });
  }
};
