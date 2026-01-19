// controllers/users/cart.controller.js
import Product from "../../models/shop/Product.model.js";
import Cart from "../../models/shop/Cart.model.js";

/**
 * ADD TO CART
 */
export async function addToCart(req, res) {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(400).json({ message: "Invalid product" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const item = cart.items.find(i => i.product.equals(productId));

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
}

/**
 * GET CART
 */
export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );

    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
}

/**
 * REMOVE ITEM
 */
export async function removeItem(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      i => !i.product.equals(req.params.productId)
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
}

/**
 * UPDATE CART ITEM QUANTITY
 */
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: "productId and quantity are required" });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(i => i.product.equals(productId));
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("UPDATE CART ITEM ERROR:", error);
    res.status(500).json({ message: "Failed to update cart item" });
  }
};
