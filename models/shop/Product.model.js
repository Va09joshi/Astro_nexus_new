import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category",default: null, },
    images: [String],
    astrologyType: {
      type: String,
      enum: ["gemstone", "pooja", "report", "consultation"],
    },
    stock: { type: Number, default: 0 },
    deliveryType: {
      type: String,
      enum: ["physical", "digital"],
      default: "physical",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
