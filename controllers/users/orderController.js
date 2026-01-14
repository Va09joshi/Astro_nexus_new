// controllers/users/orderController.js
import Order from "../../models/shop/Order.model.js";
import Product from "../../models/shop/Product.model.js"; // if you have a product model

// Place an order
export async function placeOrder(req, res) {
  try {
    const { products, shippingAddress } = req.body;
    const userId = req.user.id; // set by auth middleware

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products to order" });
    }

    // Calculate total price
    let totalPrice = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: "Product not found" });
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      user: userId,
      products,
      totalPrice,
      shippingAddress,
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

// Get user's orders
export async function getUserOrders(req, res) {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate("products.productId");
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
