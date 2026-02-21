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