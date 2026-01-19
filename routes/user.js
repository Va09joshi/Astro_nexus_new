import express from "express";
import { authenticateToken } from "../middlewares/auth.js";

// Import controllers
import { handleUserSignup, handleUserLogin, handleUserLogout } from "../controllers/users/user.js";
import * as categoryController from "../controllers/users/category.controller.js";
import * as productController from "../controllers/users/product.controller.js";
import * as cartController from "../controllers/users/cart.controller.js";
import * as orderController from "../controllers/users/orderController.js";
import * as paymentController from "../controllers/users/payment.controller.js";

const router = express.Router();

// ================== TEST ROUTE ==================
router.get("/test", (req, res) => {
  res.json({ message: "User routes are working!" });
});

// ================== AUTH ROUTES ==================
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateToken, handleUserLogout);

// ================== CATEGORY ROUTES ==================
router.get("/categories", categoryController.getActiveCategories);

// ================== PRODUCT ROUTES ==================
router.get("/products", productController.getProducts);
router.get("/products/:productId", productController.getProductById);

// ================== CART ROUTES ==================
router.get("/cart", authenticateToken, cartController.getCart);
router.post("/cart/add", authenticateToken, cartController.addToCart);
router.put("/cart/update", authenticateToken, cartController.updateCartItem);
router.delete("/cart/remove/:productId", authenticateToken, cartController.removeItem);

// ================== ORDER ROUTES ==================
router.post("/orders", authenticateToken, orderController.placeOrder);
router.get("/orders/my", authenticateToken, orderController.getUserOrders);
router.get("/orders/:orderId", authenticateToken, orderController.getOrderById);

// ================== PAYMENT ROUTES ==================
router.post("/payment/create", authenticateToken, paymentController.createPayment);
router.post("/payment/verify", authenticateToken, paymentController.verifyPayment);

console.log("User routes loaded");

export default router;
