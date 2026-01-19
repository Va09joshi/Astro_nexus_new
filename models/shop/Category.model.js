import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // for sorting categories
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
