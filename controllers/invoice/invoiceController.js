import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import Order from "../../models/shop/Order.model.js";
import { fileURLToPath } from "url";

/* ================= PATH SETUP ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const invoiceFolder = path.join(__dirname, "../../invoices");
const uploadFolder = path.join(__dirname, "../../uploads");

if (!fs.existsSync(invoiceFolder)) {
  fs.mkdirSync(invoiceFolder, { recursive: true });
}

const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

/* ================= GENERATE INVOICE ================= */

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ message: "Order ID required" });

    const order = await Order.findById(orderId)
      .populate("items.product", "name price images")
      .populate("user", "fullName email")
      .populate("address");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 80;
    const centerX = pageWidth / 2;

    /* ================= HEADER ================= */

    doc.rect(0, 0, pageWidth, 8).fill("#0f3c5f");

    doc.fillColor("#0f3c5f").font("Helvetica-Bold").fontSize(22)
      .text("ASTRONEXUS", 40, 30);

    doc.fontSize(10).fillColor("#555")
      .text("Premium Astrology & Digital Products", 40, 55);

    doc.font("Helvetica-Bold").fontSize(18).fillColor("#000")
      .text("INVOICE", 0, 40, { align: "right" });

    /* ================= META ================= */

    const metaTop = 90;
    doc.rect(40, metaTop, contentWidth, 90).stroke("#dcdcdc");

    doc.fontSize(10).fillColor("#333");
    doc.font("Helvetica-Bold").text("From:", 50, metaTop + 10);
    doc.font("Helvetica").text("Astronexus Web Pvt Ltd", 50, metaTop + 25);
    doc.text("support@astronexus.com", 50, metaTop + 40);

    doc.font("Helvetica-Bold").text("Bill To:", 300, metaTop + 10);
    doc.font("Helvetica").text(order.user?.fullName || "N/A", 300, metaTop + 25);
    doc.text(order.user?.email || "N/A", 300, metaTop + 40);

    if (order.address) {
      doc.text(
        `${order.address.line1 || ""}\n${order.address.line2 || ""}\n${order.address.city || ""}, ${order.address.state || ""}\n${order.address.zip || ""}`,
        300,
        metaTop + 55
      );
    }

    doc.font("Helvetica-Bold").text("Invoice ID:", 50, metaTop + 65);
    doc.font("Helvetica").text(String(order._id), 120, metaTop + 65);

    doc.font("Helvetica-Bold").text("Date:", 50, metaTop + 80);
    doc.font("Helvetica").text(new Date().toLocaleDateString(), 90, metaTop + 80);

    doc.font("Helvetica-Bold").text("Status:", 300, metaTop + 80);
    doc.font("Helvetica").text(order.status, 350, metaTop + 80);

    /* ================= PRODUCT TABLE ================= */

    let tableTop = metaTop + 120;

    const col = {
      image: 50,
      name: 90,
      qty: 320,
      price: 380,
      total: 450,
    };

    const drawHeader = () => {
      doc.rect(40, tableTop, contentWidth, 25).fill("#0f3c5f");
      doc.fillColor("#fff").font("Helvetica-Bold").fontSize(10)
        .text("Product", col.name, tableTop + 7)
        .text("Qty", col.qty, tableTop + 7)
        .text("Price", col.price, tableTop + 7)
        .text("Total", col.total, tableTop + 7);
      tableTop += 25;
    };

    drawHeader();
    doc.fillColor("#000").font("Helvetica").fontSize(10);

    for (const item of order.items) {
      if (tableTop > doc.page.height - 180) {
        doc.addPage();
        tableTop = 50;
        drawHeader();
      }

      doc.rect(40, tableTop, contentWidth, 45).stroke("#e6e6e6");

      // Product Image
      if (item.product?.images?.[0]) {
        const imgPath = path.join(uploadFolder, item.product.images[0]);
        if (fs.existsSync(imgPath)) {
          doc.image(imgPath, col.image, tableTop + 5, { width: 35, height: 35 });
        }
      }

      // Product Details
      doc.text(item.product?.name || "Product", col.name, tableTop + 15, { width: 210 });
      doc.text(item.quantity, col.qty, tableTop + 15);
      doc.text(formatCurrency(item.price), col.price, tableTop + 15);
      doc.text(formatCurrency(item.price * item.quantity), col.total, tableTop + 15);

      tableTop += 45;
    }

    /* ================= GRAND TOTAL (CENTERED) ================= */

    const totalBoxWidth = 260;
    const totalX = centerX - totalBoxWidth / 2;

    doc.rect(totalX, tableTop + 20, totalBoxWidth, 50).stroke("#0f3c5f");
    doc.font("Helvetica-Bold").fontSize(13)
      .text("Grand Total", totalX + 20, tableTop + 35);
    doc.text(formatCurrency(order.totalAmount), totalX + 150, tableTop + 35);

    /* ================= QR CODE (CENTERED) ================= */

    const qrBuffer = await QRCode.toBuffer(String(order._id));
    const qrSize = 110;

    doc.image(qrBuffer, centerX - qrSize / 2, tableTop + 90, { width: qrSize });

    doc.fontSize(9).fillColor("#555")
      .text("Scan to view your Order", 0, tableTop + 210, { align: "center" });

    /* ================= SOCIAL LINKS ================= */

    const socialTop = tableTop + 240;

    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000")
      .text("Connect with us", 0, socialTop, { align: "center" });

    doc.font("Helvetica").fontSize(9).fillColor("#0f3c5f");

    doc.text("Website", centerX - 90, socialTop + 20, {
      link: "https://astronexus.com",
      underline: true,
    });

    doc.text("Instagram", centerX - 20, socialTop + 20, {
      link: "https://instagram.com/astronexus",
      underline: true,
    });

    doc.text("Support", centerX + 70, socialTop + 20, {
      link: "mailto:support@astronexus.com",
      underline: true,
    });

    /* ================= FOOTER ================= */

    doc.rect(0, doc.page.height - 20, pageWidth, 20).fill("#0f3c5f");
    doc.fillColor("#fff").fontSize(8)
      .text("Thank you for shopping with Astronexus", 0, doc.page.height - 15, {
        align: "center",
      });

    doc.end();

    stream.on("finish", () => {
      res.json({
        success: true,
        invoiceUrl: `/api/invoice/download/${orderId}`,
      });
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    res.status(500).json({
      message: "Invoice generation failed",
      error: err.message,
    });
  }
};

/* ================= DOWNLOAD ================= */

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);

    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${orderId}.pdf`);
    fs.createReadStream(pdfPath).pipe(res);
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ message: "Download failed" });
  }
};
