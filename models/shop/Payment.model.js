const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },

  gateway: {
    type: String
  },

  transactionId: {
    type: String
  },

  amount: Number,

  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
