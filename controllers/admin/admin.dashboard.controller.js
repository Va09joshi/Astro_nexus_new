import User from "../../models/user/user.js";
import Product from "../../models/shop/Product.model.js";
import Order from "../../models/shop/Order.model.js";

// ================= ADMIN DASHBOARD =================
export const getDashboardOverview = async (req, res) => {
  try {
    // 1️⃣ Total counts + latest users
    const [totalUsers, totalProducts, totalOrders, recentUsers] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email createdAt"),
    ]);

    // 2️⃣ Recent orders (last 5) with product images
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    // 3️⃣ Total revenue
    const revenueAgg = await Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Completed"] } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // 4️⃣ Most purchased product
    const mostPurchasedProductAgg = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 1 },
    ]);

    let mostPurchasedProduct = null;
    if (mostPurchasedProductAgg.length > 0) {
      const productId = mostPurchasedProductAgg[0]._id;
      const prodDoc = await Product.findById(productId).select("name images price");
      if (prodDoc) {
        mostPurchasedProduct = prodDoc.toObject();
        mostPurchasedProduct.totalSold = mostPurchasedProductAgg[0].totalSold;
      } else {
        console.warn(`Dashboard: product ${productId} not found`);
      }
    }

    // 5️⃣ Top user by total purchase
    const topUserAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 1 },
    ]);

    let topUser = null;
    if (topUserAgg.length > 0) {
      const userId = topUserAgg[0]._id;
      const userDoc = await User.findById(userId).select("name email");
      if (userDoc) {
        topUser = userDoc.toObject();
        topUser.totalSpent = topUserAgg[0].totalSpent;
      } else {
        console.warn(`Dashboard: user ${userId} not found`);
      }
    }

    // 6️⃣ Admin list
    const admins = await User.find({ role: "admin" }).select("name email createdAt");

    // ================== RESPONSE ==================
    res.status(200).json({
      totals: { totalUsers, totalProducts, totalOrders, totalRevenue },
      recentUsers,
      recentOrders,
      mostPurchasedProduct,
      topUser,
      admins,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};