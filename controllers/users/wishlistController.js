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

// Get wishlist for the authenticated user
exports.getWishlist = async (req, res) => {
  try {
    // Ensure req.user is set by your authenticateToken middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Fetch wishlist for this user
    const wishlist = await Wishlist.findOne({ userId });

    // Return wishlist or empty array if not found
    return res.status(200).json(wishlist || { products: [] });
  } catch (err) {
    console.error('Error fetching wishlist:', err);
    return res.status(500).json({ error: 'Failed to fetch wishlist', details: err.message });
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