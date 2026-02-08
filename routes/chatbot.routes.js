import express from "express";
import { askAstrologyChatbot } from "../controllers/chat/chatbot.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// User must be logged in
router.post("/ask", authenticateToken, askAstrologyChatbot);

export default router;
