const router = require("express").Router();
const c = require("../../controllers/admin/admin.order.controller");
const { authenticateToken } = require("../../middlewares/auth.js");
const admin = require("../../middlewares/admin.middleware.js");

router.use(authenticateToken, admin);


router.get("/", c.getAllOrders);
router.put("/:id", c.updateStatus);

module.exports = router;
