import Feedback from "../models/shop/feedback.model.js";
import mongoose from "mongoose";


// Create feedback
export const createFeedback = async (req, res) => {
  try {
    const { productId, description } = req.body;
    const user = req.user; // from authenticateToken middleware

    if (!productId || !description) {
      return res.status(400).json({ success: false, message: "Product ID and description are required" });
    }

    if (!user || !user._id || !user.name) {
      return res.status(401).json({ success: false, message: "User information missing" });
    }

    const feedback = new Feedback({
      productId: mongoose.Types.ObjectId(productId),
      userId: user._id,
      userName: user.name,
      userDisplay: user.astrologyProfile || "",
      description,
    });

    await feedback.save();
    res.status(201).json({ success: true, message: "Feedback created", feedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Get feedbacks for a product
export const getFeedbackByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const feedbacks = await Feedback.find({ productId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all feedbacks (for admin)
export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name") // optional: show product name
      .populate("userId", "name email"); // optional: show user info

    res.status(200).json({ success: true, feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
