// controllers/users/product.controller.js
import Product from "../../models/shop/Product.model.js";
import mongoose from "mongoose";


/**
 * =========================
 * GET ALL PRODUCTS
 * Optional: filter by category
 * =========================
 */
export async function getProducts(req, res) {
  try {
    const filter = {
      isActive: true,
      isDeleted: false,
    };

    // Optional category filter (?category=categoryId)
    if (req.query.category) {
      filter.category = req.query.category.trim();
      console.log("Filtering products by category:", filter.category);
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    console.log("Fetched products count:", products.length);

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

/**
 * =========================
 * GET PRODUCT BY ID
 * =========================
 */
export const getProductById = async (req, res) => {
  try {
    let productId = decodeURIComponent(req.params.id).trim();
    console.log("Fetching product ID:", productId);

    // Use Mongoose's built-in ObjectId check
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId)
      .populate("category", "name");

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found or inactive" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



