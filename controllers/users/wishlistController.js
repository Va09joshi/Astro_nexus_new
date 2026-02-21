// controllers/wishlistController.js
const Wishlist = require('../../models/shop/Wishlist.js');

// Add new wishlist or update existing
exports.addWishlist = async (req, res) => {
  const { userId, products } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.products = products; // overwrite products
      await wishlist.save();
    } else {
      wishlist = new Wishlist({ userId, products });
      await wishlist.save();
    }
    res.json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get wishlist for a user
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlist = await Wishlist.findOne({ userId });
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a product from wishlist
exports.removeProduct = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(p => p !== productId);
      await wishlist.save();
      res.json(wishlist);
    } else {
      res.status(404).json({ error: 'Wishlist not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};