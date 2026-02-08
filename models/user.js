import mongoose from "mongoose";
import crypto from "crypto";

const astrologySchema = new mongoose.Schema({
  dateOfBirth: { type: Date },
  timeOfBirth: { type: String }, // "14:35"
  placeOfBirth: { type: String }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    phone: { type: String, required: true, unique: true },

    password: { type: String, required: true, select: false },

    // Optional but unique email
    email: { type: String, unique: true, sparse: true },

    // ⭐ Permanent session ID for astrology conversations
    sessionId: {
      type: String,
      unique: true,
      index: true,
      default: () => crypto.randomBytes(16).toString("hex")
    },

    // Astrology profile
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
