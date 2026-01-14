import User from "../../models/user.js";
import Product from "../../models/shop/Product.model.js";
import Category from "../../models/Category.js";

// Dashboard overview
export const getDashboardOverview = async (req, res) => {
  try {
    // Count documents in parallel
    const [totalUsers, totalProducts, totalCategories] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Category.countDocuments(),
    ]);

    // Optional: fetch last 5 users
    const recentUsers = await User.find()
      .select("name email createdAt")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalCategories,
        recentUsers,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message });
  }
};
