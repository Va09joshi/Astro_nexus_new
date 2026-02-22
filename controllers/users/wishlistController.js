// controllers/wishlistController.js
const Wishlist = require('../../models/shop/Wishlist.js');

// Add or update wishlist
exports.addWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // get userId from token
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

    res.json(wishlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get wishlist for logged-in user
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id; // get userId from token
    const wishlist = await Wishlist.findOne({ userId });
    res.json(wishlist || { products: [] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a product from wishlist
exports.removeProduct = async (req, res) => {
  try {
    const userId = req.user._id; // get userId from token
    const { productId } = req.body;

    if (!productId) return res.status(400).json({ error: 'productId is required' });

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