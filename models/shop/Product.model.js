const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  },

  images: [String],

  astrologyType: {
    type: String,
    enum: ["gemstone", "pooja", "report", "consultation"]
  },

  stock: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);
