const router = require("express").Router();

// Auth controller
const authController = require("../../controllers/admin/admin.auth.controller");

// User management controller
const userController = require("../../controllers/admin/admin.user.controller"); // create this

// Auth route
router.post("/login", authController.login);

// User management routes
router.get("/users", userController.getAllUsers);               // GET /admin/users
router.patch("/users/:id/block", userController.toggleUserBlock);     // PATCH /admin/users/:id/block

module.exports = router;
