const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    quantity: Number,
    price: Number
  }],

  totalAmount: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  orderStatus: {
    type: String,
    enum: ["CREATED", "PROCESSING", "COMPLETED", "CANCELLED"],
    default: "CREATED"
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
