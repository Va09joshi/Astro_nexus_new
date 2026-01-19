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
      stock,
      description,
      images,
      isActive
    } = req.body;

    // ✅ REQUIRED VALIDATION
    if (!name || price === undefined || !astrologyType) {
      return res.status(400).json({
        message: "Name, price and astrologyType are required"
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        message: "Price must be greater than 0"
      });
    }

    // ✅ CATEGORY VALIDATION (SAFE)
    let categoryId = null;
    if (category) {
      const cat = await Category.findOne({
        _id: category,
        isActive: true
      });

      if (!cat) {
        return res.status(400).json({
          message: "Invalid or inactive category"
        });
      }

      categoryId = cat._id;
    }

    // ✅ CREATE PRODUCT (NO req.body SPREAD)
    const product = await Product.create({
      name,
      description,
      price,
      stock: stock ?? 0,
      category: categoryId,
      astrologyType,
      images: Array.isArray(images) ? images : [],
      isActive: isActive ?? true
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product
    });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
};


/**
 * ================= GET ALL PRODUCTS (ADMIN) =================
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isDeleted: { $ne: true } // ✅ prevent soft-deleted crash
    })
      .populate({
        path: "category",
        select: "name isActive",
        options: { strictPopulate: false } // ✅ CRITICAL FIX
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({
      message: err.message || "Failed to fetch products"
    });
  }
};

/**
 * ================= GET SINGLE PRODUCT =================
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: "category",
        select: "name isActive",
        options: { strictPopulate: false }
      });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
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
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * ================= SOFT DELETE =================
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
    console.error("DEACTIVATE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
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
    console.error("DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
