const router = require("express").Router();
const controller = require("../../controllers/admin/admin.category.controller");
const { authenticateToken } = require("../../middlewares/auth");
const adminOnly = require("../../middlewares/admin.middleware");

// Apply middlewares to all routes
router.use(authenticateToken, adminOnly);

// Routes
router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/:id", controller.update);
router.patch("/:id/toggle", controller.toggleStatus);

module.exports = router;
