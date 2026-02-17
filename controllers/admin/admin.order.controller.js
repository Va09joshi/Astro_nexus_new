const Order = require("../../models/shop/Order.model.js");

/**
 * GET ALL ORDERS (ADMIN)
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({ path: "items.product", select: "name price images" })
      .populate({ path: "user", select: "name email" })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("GET ALL ORDERS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * UPDATE ORDER STATUS
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ message: "ID and status required" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("items.product", "name price images");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error("UPDATE ORDER STATUS ERROR:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * DELETE ORDER (ADMIN)
 */
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      success: true,
      message: "Order deleted successfully",
      orderId: id
    });
  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

/**
 * ORDER COUNTS (ADMIN DASHBOARD)
 */
exports.getOrderCounts = async (req, res) => {
  try {
    const total = await Order.countDocuments();
    const completed = await Order.countDocuments({ status: "completed" });
    const pending = await Order.countDocuments({ status: "pending" });
    const cancelled = await Order.countDocuments({ status: "cancelled" });

    res.json({
      success: true,
      total,
      completed,
      pending,
      cancelled
    });
  } catch (err) {
    console.error("ORDER COUNT ERROR:", err);
    res.status(500).json({ message: "Failed to get order counts" });
  }
};

/**
 * GET ORDERS BY USER (ADMIN)
 */
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    console.error("GET USER ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to get user orders" });
  }
};
