const Product = require("../../models/shop/Product.model");
const Category = require("../../models/shop/Category.model");

/**
 * ================= CREATE PRODUCT =================
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      astrologyType,
      stock
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be greater than 0" });
    }

    let categoryId;
    if (category) {
      const cat = await Category.findOne({ _id: category, isActive: true });
      if (!cat) {
        return res.status(400).json({ message: "Invalid or inactive category" });
      }
      categoryId = cat._id;
    }

    const product = await Product.create({
      ...req.body,
      category: categoryId,
      stock: stock ?? 0,
      astrologyType
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Product creation failed" });
  }
};

/**
 * ================= GET ALL PRODUCTS (ADMIN) =================
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name isActive")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

/**
 * ================= GET SINGLE PRODUCT =================
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name isActive");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

/**
 * ================= UPDATE PRODUCT =================
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.category) {
      const cat = await Category.findOne({
        _id: req.body.category,
        isActive: true
      });

      if (!cat) {
        return res.status(400).json({ message: "Invalid category" });
      }
      req.body.category = cat._id;
    }

    Object.assign(product, req.body);
    await product.save();

    res.json({
      message: "Product updated successfully",
      product
    });

  } catch (err) {
    res.status(500).json({ message: "Product update failed" });
  }
};

/**
 * ================= SOFT DELETE (DEACTIVATE) =================
 */
exports.deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isActive = false;
    product.isDeleted = true;
    await product.save();

    res.json({ message: "Product deactivated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Deactivation failed" });
  }
};

/**
 * ================= PERMANENT DELETE =================
 */
exports.deleteProductPermanent = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product permanently deleted" });
  } catch (err) {
    res.status(500).json({ message: "Permanent delete failed" });
  }
};
