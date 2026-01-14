const router = require("express").Router();
const c = require("../../controllers/admin/admin.product.controller");
const auth = require("../../middlewares/auth.js");  // Note the .js extension
const { authenticateToken } = auth;                // Destructure the function
const admin = require("../../middlewares/admin.middleware");



router.use(authenticateToken);
router.use(admin);

router.post("/", c.create);
router.get("/", c.getAll);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
