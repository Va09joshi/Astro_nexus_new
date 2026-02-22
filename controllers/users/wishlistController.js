// controllers/wishlistController.js
const Wishlist = require('../../models/shop/Wishlist.js');

// Add or update wishlist
exports.addWishlist = async (req, res) => {
  try {
    const userId = req.userId; // <-- use req.userId from middleware
    const { products } = req.body;

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ error: 'Products array is required' });
    }

    let wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.products = products; // overwrite products
      await wishlist.save();
    } else {
      wishlist = new Wishlist({ userId, products });
      await wishlist.save();
    }

    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Add wishlist error:", err);
    res.status(400).json({ error: err.message });
  }
};


// Get wishlist for the authenticated user
// Get wishlist for a user
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.userId; // <-- use req.userId from middleware
    const wishlist = await Wishlist.findOne({ userId });
    res.status(200).json(wishlist || { products: [] });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(400).json({ error: err.message });
  }
};


// Remove a product from wishlist
exports.removeProduct = async (req, res) => {
  try {
    const userId = req.userId; // <-- use req.userId from middleware
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ error: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(p => p !== productId);
    await wishlist.save();

    res.status(200).json(wishlist);
  } catch (err) {
    console.error("Remove wishlist product error:", err);
    res.status(400).json({ error: err.message });
  }
};