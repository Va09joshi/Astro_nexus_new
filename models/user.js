import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    phone: { type: String, required: true },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    lastLoginAt: {
      type: Date
    },

    /* ============================
       BIRTH DETAILS (ASTRO READY)
       ============================ */
    birthDetails: {
      date: {
        type: Date,
        required: true
      },
      time: {
        type: String, // HH:mm (24-hour)
        required: true
      },
      place: {
        type: String,
        required: true
      },
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      },
      timezone: {
        type: Number, // e.g. +5.5
        required: true
      }
    }

  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
