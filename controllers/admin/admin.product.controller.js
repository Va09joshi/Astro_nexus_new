const Product = require("../../models/shop/Product.model");
const Category = require("../../models/shop/Category.model");

// ================= CREATE PRODUCT =================
exports.create = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Required fields
    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    // Validate category if provided
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists || !categoryExists.isActive) {
        return res.status(400).json({ message: "Invalid or inactive category" });
      }
    }

    const product = await Product.create(req.body);
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: "Product creation failed", error: err.message });
  }
};

// ================= GET ALL PRODUCTS =================
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name isActive") // populate only if category exists
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ================= UPDATE PRODUCT =================
exports.update = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate category if provided
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists || !categoryExists.isActive) {
        return res.status(400).json({ message: "Invalid or inactive category" });
      }
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: "Product update failed" });
  }
};

// ================= SOFT DELETE (Deactivate) =================
exports.remove = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deactivated successfully" });

  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
