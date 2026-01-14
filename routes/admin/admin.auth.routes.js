const router = require("express").Router();
const controller = require("../../controllers/admin/admin.auth.controller");

router.post("/login", controller.login);

module.exports = router;
