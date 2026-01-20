import express from "express";
import {
  login,
  updatePassword,
  logout,
} from "../../controllers/admin/admin.auth.controller.js";

import { authenticateToken } from "../../middlewares/auth.js";

const router = express.Router();

// admin login
router.post("/login", login);

// update admin password
router.put("/update-password", authenticateToken, updatePassword);
router.post("/logout", authenticateToken, logout);

export default router;
