import express from "express";
import { generateInvoice, downloadInvoice } from "../../controllers/invoice/invoiceController.js";

const router = express.Router();

router.get("/generate/:orderId", generateInvoice);

// Download invoice PDF
router.get("/download/:orderId", downloadInvoice);

export default router;
