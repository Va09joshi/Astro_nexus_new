const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: true
  },

  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],

  isPublic: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

wishlistSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);