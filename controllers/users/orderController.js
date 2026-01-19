import Order from "../../models/shop/Order.model.js";
import Cart from "../../models/shop/Cart.model.js";

/**
 * PLACE ORDER
 * Called after successful payment
 */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: userId,
      items: cart.items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
        price: i.product.price
      })),
      totalAmount,
      status: "Placed"
    });

    // Clear cart after order
    await Cart.deleteOne({ _id: cart._id });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    return res.status(500).json({ message: "Order creation failed" });
  }
};

/**
 * GET USER ORDERS
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.product", "name price images");

    if (!order || order.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    return res.status(500).json({ message: "Failed to fetch order" });
  }
};

