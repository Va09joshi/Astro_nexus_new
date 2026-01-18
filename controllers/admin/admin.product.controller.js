const Product = require("../../models/shop/Product.model");
const Category = require("../../models/shop/Category.model");

// ================= CREATE PRODUCT =================
exports.create = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // ================= BASIC VALIDATION =================
    if (!name || price === undefined || price === null) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (typeof price !== "number" || price <= 0) {
      return res.status(400).json({ message: "Price must be a valid number greater than 0" });
    }

    // ================= CATEGORY VALIDATION =================
    let categoryId;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Category does not exist" });
      }
      if (!categoryExists.isActive) {
        return res.status(400).json({ message: "Category is inactive" });
      }
      categoryId = categoryExists._id; // safe ObjectId
    }

    // ================= CREATE PRODUCT =================
    const product = await Product.create({
      ...req.body,
      category: categoryId, // undefined if no category
    });

    return res.status(201).json(product);

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    return res.status(500).json({
      message: "Product creation failed",
      error: err.message,
    });
  }
};

// ================= GET ALL PRODUCTS =================
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name isActive")
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
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists || !categoryExists.isActive) {
        return res.status(400).json({ message: "Invalid or inactive category" });
      }
      req.body.category = categoryExists._id;
    } else {
      delete req.body.category;
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
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isActive = false;
    await product.save();

    res.json({ message: "Product deactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
