const router = require("express").Router();
const c = require("../../controllers/admin/admin.order.controller");
const { authenticateToken } = require("../../middlewares/auth.js");
const admin = require("../../middlewares/admin.middleware.js");

// Apply auth + admin middleware to all routes
router.use(authenticateToken, admin);

// GET all orders
router.get("/all", c.getAllOrders);

// UPDATE order status
router.put("/:id/status", c.updateStatus);

// DELETE order
router.delete("/:id", c.deleteOrder);

// ORDER COUNTS (dashboard)
router.get("/counts", c.getOrderCounts);

// GET orders of a particular user
router.get("/user/:userId", c.getOrdersByUser);

module.exports = router;
