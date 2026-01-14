const router = require("express").Router();
const controller = require("../../controllers/admin/admin.category.controller");
const authenticate = require("../../middlewares/auth");
const adminOnly = require("../../middlewares/adminOnly");

router.use(authenticate, adminOnly);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/:id", controller.update);
router.patch("/:id/toggle", controller.toggleStatus);

module.exports = router;
