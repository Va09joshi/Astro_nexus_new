import User from "../../models/user.js";
import Product from "../../models/shop/Product.model.js";
import Order from "../../models/shop/Order.model.js";

export const getDashboardOverview = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, recentUsers] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({ totalUsers, totalProducts, totalOrders, recentUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
