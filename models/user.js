import mongoose from "mongoose";

const astrologySchema = new mongoose.Schema({
  dateOfBirth: { type: Date },
  timeOfBirth: { type: String }, // "14:35"
  placeOfBirth: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },

    // Secondary email (optional but unique if provided)
    email: { type: String, unique: true, sparse: true },

    // Astrology profile (optional during basic signup)
    astrologyProfile: astrologySchema,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    lastLoginAt: Date
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
