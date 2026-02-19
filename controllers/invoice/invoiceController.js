import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import Order from "../../models/shop/Order.model.js";

const invoiceFolder = path.join("invoices");
if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder);

const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

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
    doc.pipe(fs.createWriteStream(pdfPath));

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

    /* ================= ORDER META BOX ================= */

    const metaTop = 90;

    doc
      .rect(40, metaTop, contentWidth, 90)
      .stroke("#dcdcdc");

    doc.fontSize(10).fillColor("#333");

    // Seller
    doc.font("Helvetica-Bold").text("From:", 50, metaTop + 10);
    doc.font("Helvetica").text("Astronexus Web Pvt Ltd", 50, metaTop + 25);
    doc.text("support@astronexus.com", 50, metaTop + 40);

    // Customer
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

    // Invoice Details
    doc.font("Helvetica-Bold").text("Invoice ID:", 50, metaTop + 65);
    doc.font("Helvetica").text(order._id, 120, metaTop + 65);

    doc.font("Helvetica-Bold").text("Date:", 50, metaTop + 80);
    doc.font("Helvetica").text(new Date().toLocaleDateString(), 90, metaTop + 80);

    doc.font("Helvetica-Bold").text("Status:", 300, metaTop + 80);
    doc.font("Helvetica").text(order.status, 350, metaTop + 80);

    /* ================= TABLE ================= */

    let tableTop = metaTop + 120;
    const columnPositions = {
      product: 50,
      qty: 330,
      price: 380,
      total: 450,
    };

    const drawTableHeader = () => {
      doc
        .rect(40, tableTop, contentWidth, 25)
        .fill("#0f3c5f");

      doc
        .fillColor("#fff")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Product", columnPositions.product, tableTop + 7)
        .text("Qty", columnPositions.qty, tableTop + 7)
        .text("Price", columnPositions.price, tableTop + 7)
        .text("Total", columnPositions.total, tableTop + 7);

      tableTop += 25;
    };

    drawTableHeader();
    doc.font("Helvetica").fontSize(10).fillColor("#000");

    order.items.forEach((item, index) => {
      if (tableTop > doc.page.height - 100) {
        doc.addPage();
        tableTop = 50;
        drawTableHeader();
      }

      const rowHeight = 40;

      doc.rect(40, tableTop, contentWidth, rowHeight).stroke("#e6e6e6");

      // Image
      if (item.product?.images?.[0]) {
        const imgPath = path.join("uploads", item.product.images[0]);
        if (fs.existsSync(imgPath)) {
          doc.image(imgPath, 45, tableTop + 5, { width: 30, height: 30 });
        }
      }

      doc.text(item.product?.name || "Product", 80, tableTop + 12, {
        width: 230,
      });

      doc.text(item.quantity, columnPositions.qty, tableTop + 12);
      doc.text(formatCurrency(item.price), columnPositions.price, tableTop + 12);
      doc.text(
        formatCurrency(item.price * item.quantity),
        columnPositions.total,
        tableTop + 12
      );

      tableTop += rowHeight;
    });

    /* ================= TOTAL BOX ================= */

    doc
      .rect(300, tableTop + 10, 240, 50)
      .stroke("#0f3c5f");

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Grand Total", 310, tableTop + 25);

    doc
      .font("Helvetica-Bold")
      .text(formatCurrency(order.totalAmount), 430, tableTop + 25);

    /* ================= QR SECTION ================= */

    const qrBuffer = await QRCode.toBuffer(order._id); // only order ID

    doc.image(qrBuffer, 50, tableTop + 80, { width: 90 });

    doc
      .fontSize(9)
      .fillColor("#555")
      .text("Scan to view Order ID", 50, tableTop + 175);

    /* ================= FOOTER ================= */

    doc
      .rect(0, doc.page.height - 20, pageWidth, 20)
      .fill("#0f3c5f");

    doc
      .fillColor("#fff")
      .fontSize(8)
      .text(
        "Thank you for shopping with Astronexus",
        0,
        doc.page.height - 15,
        { align: "center" }
      );

    doc.end();

    res.json({
      success: true,
      invoiceUrl: `/api/invoice/download/${order._id}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);

    if (!fs.existsSync(pdfPath))
      return res.status(404).json({ message: "Invoice not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${orderId}.pdf`);

    fs.createReadStream(pdfPath).pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
  }
};
