// models/Discount.js
import mongoose from "mongoose";

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  percentage: { type: Number, required: true },
  expiry: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("Discount", discountSchema);