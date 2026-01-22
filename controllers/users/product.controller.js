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
export const getProductById = async (req, res) => {
  try {
    let productId = req.params.id;

    console.log("Raw productId:", JSON.stringify(productId));

    // Remove newline, spaces, URL encoding
    productId = decodeURIComponent(productId).trim();

    console.log("Clean productId:", productId);

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId)
      .populate("category", "name");

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

