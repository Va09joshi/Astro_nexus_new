// controllers/discountController.js
import Discount from "../models/shop/Discount.js";

// Create a new discount
export const createDiscount = async (req, res) => {
  const { code, percentage, expiry } = req.body;
  try {
    const discount = new Discount({ code, percentage, expiry });
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all active discounts
export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find({ active: true });
    res.json(discounts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get discount by code
export const getDiscountByCode = async (req, res) => {
  const { code } = req.params;
  try {
    const discount = await Discount.findOne({ code, active: true });
    if (!discount) return res.status(404).json({ error: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update discount
export const updateDiscount = async (req, res) => {
  const { discountId } = req.params;
  const updates = req.body;
  try {
    const discount = await Discount.findByIdAndUpdate(discountId, updates, { new: true });
    if (!discount) return res.status(404).json({ error: "Discount not found" });
    res.json(discount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Soft delete discount
export const deleteDiscount = async (req, res) => {
  const { discountId } = req.params;
  try {
    const discount = await Discount.findByIdAndUpdate(discountId, { active: false }, { new: true });
    if (!discount) return res.status(404).json({ error: "Discount not found" });
    res.json({ message: "Discount deactivated", discount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Apply discount to a given amount
export const applyDiscount = async (req, res) => {
  const { code, amount } = req.body; // amount: total order/cart amount
  try {
    // Find active discount by code
    const discount = await Discount.findOne({ code, active: true });
    if (!discount) {
      return res.status(404).json({ error: "Discount not found" });
    }

    // Check expiry
    const now = new Date();
    if (discount.expiry < now) {
      return res.status(400).json({ error: "Discount code has expired" });
    }

    // Calculate discounted amount
    const discountAmount = (amount * discount.percentage) / 100;
    const finalAmount = amount - discountAmount;

    res.json({
      originalAmount: amount,
      discountAmount,
      finalAmount,
      discountCode: discount.code,
      discountPercentage: discount.percentage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};