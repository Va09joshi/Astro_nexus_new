// controllers/users/product.controller.js
import Product from "../../models/shop/Product.model.js";

/**
 * LIST PRODUCTS (optional category filter)
 */
export async function getProducts(req, res) {
  try {
    const filter = {
      isActive: true
    };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

/**
 * PRODUCT DETAILS
 */
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name");

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
}
