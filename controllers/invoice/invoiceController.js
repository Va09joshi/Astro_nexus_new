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

if (!fs.existsSync(invoiceFolder)) {
  fs.mkdirSync(invoiceFolder, { recursive: true });
}

const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

/* ================= GENERATE INVOICE ================= */

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({ message: "Order ID required" });
    }

    const order = await Order.findById(orderId)
      .populate("items.product", "name price images")
      .populate("user", "fullName email")
      .populate("address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const pageWidth = doc.page.width;
    const contentWidth = pageWidth - 80;

    /* ================= HEADER ================= */

    doc.rect(0, 0, pageWidth, 8).fill("#0f3c5f");

    doc
      .fillColor("#0f3c5f")
      .font("Helvetica-Bold")
      .fontSize(22)
      .text("ASTRONEXUS", 40, 30);

    doc
      .fontSize(10)
      .fillColor("#555")
      .text("Premium Astrology & Digital Products", 40, 55);

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor("#000")
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
      const addressText = [
        order.address.line1,
        order.address.line2,
        `${order.address.city}, ${order.address.state}`,
        order.address.zip,
      ]
        .filter(Boolean)
        .join("\n");

      doc.text(addressText, 300, metaTop + 55);
    }

    doc.font("Helvetica-Bold").text("Invoice ID:", 50, metaTop + 65);
    doc.font("Helvetica").text(String(order._id), 120, metaTop + 65);

    doc.font("Helvetica-Bold").text("Date:", 50, metaTop + 80);
    doc.font("Helvetica").text(
      new Date().toLocaleDateString(),
      90,
      metaTop + 80
    );

    doc.font("Helvetica-Bold").text("Status:", 300, metaTop + 80);
    doc.font("Helvetica").text(order.status, 350, metaTop + 80);

    /* ================= TABLE ================= */

    let tableTop = metaTop + 120;
    const columns = { product: 50, qty: 330, price: 380, total: 450 };

    const drawHeader = () => {
      doc.rect(40, tableTop, contentWidth, 25).fill("#0f3c5f");
      doc
        .fillColor("#fff")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Product", columns.product, tableTop + 7)
        .text("Qty", columns.qty, tableTop + 7)
        .text("Price", columns.price, tableTop + 7)
        .text("Total", columns.total, tableTop + 7);
      tableTop += 25;
    };

    drawHeader();
    doc.font("Helvetica").fontSize(10).fillColor("#000");

    for (const item of order.items) {
      if (tableTop > doc.page.height - 120) {
        doc.addPage();
        tableTop = 50;
        drawHeader();
      }

      doc.rect(40, tableTop, contentWidth, 40).stroke("#e6e6e6");

      if (item.product?.images?.[0]) {
        const imgPath = path.join(
          __dirname,
          "../../uploads",
          item.product.images[0]
        );
        if (fs.existsSync(imgPath)) {
          doc.image(imgPath, 45, tableTop + 5, {
            width: 30,
            height: 30,
          });
        }
      }

      doc.text(item.product?.name || "Product", 80, tableTop + 12, {
        width: 230,
      });

      doc.text(item.quantity, columns.qty, tableTop + 12);
      doc.text(formatCurrency(item.price), columns.price, tableTop + 12);
      doc.text(
        formatCurrency(item.price * item.quantity),
        columns.total,
        tableTop + 12
      );

      tableTop += 40;
    }

    /* ================= TOTAL ================= */

    doc.rect(300, tableTop + 10, 240, 50).stroke("#0f3c5f");
    doc.font("Helvetica-Bold").fontSize(12).text("Grand Total", 310, tableTop + 25);
    doc.text(formatCurrency(order.totalAmount), 430, tableTop + 25);

    /* ================= QR ================= */

    const qrBuffer = await QRCode.toBuffer(String(order._id));
    doc.image(qrBuffer, 50, tableTop + 80, { width: 90 });
    doc.fontSize(9).fillColor("#555").text("Scan to view Order ID", 50, tableTop + 175);

    /* ================= FOOTER ================= */

    doc.rect(0, doc.page.height - 20, pageWidth, 20).fill("#0f3c5f");
    doc
      .fillColor("#fff")
      .fontSize(8)
      .text("Thank you for shopping with Astronexus", 0, doc.page.height - 15, {
        align: "center",
      });

    doc.end();

    writeStream.on("finish", () => {
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
