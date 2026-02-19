import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import Order from "../../models/shop/Order.model.js";

const invoiceFolder = path.join("invoices");
if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder);

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) return res.status(400).json({ message: "Order ID required" });

    const order = await Order.findById(orderId)
      .populate("items.product", "name price images")
      .populate("user", "fullName email")
      .populate("address")
      .populate("paymentId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(fs.createWriteStream(pdfPath));

    // ================= HEADER =================
    const logoPath = path.join("assets", "logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 100 });
    }

    doc
      .fillColor("#1f4e79")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("ASTRONEXUS INVOICE", 200, 50, { align: "center" });

    doc.moveDown(2);

    // ================= ORDER INFO =================
    const orderInfoTop = 120;
    doc.fontSize(10).fillColor("#333");

    // From / To Table
    doc.rect(50, orderInfoTop, 500, 70).stroke("#cccccc"); // outer border

    // Seller Info
    doc.font("Helvetica-Bold").text("From:", 60, orderInfoTop + 10);
    doc.font("Helvetica").text("Astronexus Web", 60, orderInfoTop + 25);
    doc.text("Email: support@astronexus.com", 60, orderInfoTop + 40);

    // Customer Info
    doc.font("Helvetica-Bold").text("To:", 320, orderInfoTop + 10);
    doc.font("Helvetica").text(order.user.fullName || "N/A", 320, orderInfoTop + 25);
    doc.text(order.user.email || "N/A", 320, orderInfoTop + 40);
    if (order.address) {
      doc.text(
        `${order.address.line1}, ${order.address.city}, ${order.address.state}, ${order.address.zip}`,
        320,
        orderInfoTop + 55
      );
    }

    // Invoice Details (ID, Date, Status)
    doc.font("Helvetica-Bold").text(`Invoice ID:`, 50, orderInfoTop + 90);
    doc.font("Helvetica").text(order._id, 120, orderInfoTop + 90);
    doc.font("Helvetica-Bold").text(`Date:`, 300, orderInfoTop + 90);
    doc.font("Helvetica").text(new Date().toLocaleDateString(), 340, orderInfoTop + 90);
    doc.font("Helvetica-Bold").text(`Status:`, 450, orderInfoTop + 90);
    doc.font("Helvetica").text(order.status, 490, orderInfoTop + 90);

    // ================= PRODUCTS TABLE =================
    const tableTop = orderInfoTop + 130;
    const rowHeight = 40;
    const tableLeft = 50;
    const tableWidth = 500;

    // Table Header
    doc.rect(tableLeft, tableTop, tableWidth, rowHeight).fill("#1f4e79");
    doc.fillColor("#fff").font("Helvetica-Bold").fontSize(10);
    const headers = ["Product", "Qty", "Price", "Total"];
    const headerX = [tableLeft + 10, tableLeft + 250, tableLeft + 320, tableLeft + 400];
    headers.forEach((header, i) => doc.text(header, headerX[i], tableTop + 12, { width: 100, align: "center" }));

    let y = tableTop + rowHeight;

    doc.font("Helvetica").fontSize(10).fillColor("#333");

    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];

      // Alternating row color
      if (i % 2 === 0) {
        doc.rect(tableLeft, y, tableWidth, rowHeight).fill("#f7f7f7");
        doc.fillColor("#333");
      }

      // Product image
      if (item.product.images && item.product.images[0]) {
        try {
          const imgPath = path.join("uploads", item.product.images[0]);
          if (fs.existsSync(imgPath)) {
            doc.image(imgPath, tableLeft + 10, y + 5, { width: 30, height: 30 });
          }
        } catch (err) {
          console.error("Image load error:", err);
        }
      }

      doc.text(item.product.name, tableLeft + 50, y + 12, { width: 150 });
      doc.text(item.quantity, tableLeft + 250, y + 12, { width: 50, align: "center" });
      doc.text(`$${item.price}`, tableLeft + 320, y + 12, { width: 60, align: "center" });
      doc.text(`$${item.price * item.quantity}`, tableLeft + 400, y + 12, { width: 60, align: "center" });

      y += rowHeight;
    }

    // Total Row
    doc.rect(tableLeft, y, tableWidth, rowHeight).fill("#1f4e79");
    doc.fillColor("#fff").font("Helvetica-Bold").text(
      `Total: $${order.totalAmount}`,
      tableLeft + 300,
      y + 12,
      { width: 100, align: "center" }
    );

    // ================= QR CODE =================
    const orderUrl = `https://astro-nexus-new-6.onrender.com/user/orders/${order._id}`;
    const qrDataUrl = await QRCode.toDataURL(orderUrl);
    const qrBuffer = Buffer.from(qrDataUrl.replace(/^data:image\/png;base64,/, ""), "base64");
    doc.image(qrBuffer, 220, y + 60, { fit: [100, 100], align: "center" });
    doc.fontSize(10).fillColor("#333").text("Scan to view order details", 180, y + 165, { align: "center" });

    doc.end();

    res.json({
      success: true,
      message: "Invoice generated",
      invoiceUrl: `/api/invoice/download/${order._id}`,
    });
  } catch (err) {
    console.error("GENERATE INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to generate invoice" });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);

    if (!fs.existsSync(pdfPath)) return res.status(404).json({ message: "Invoice not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${orderId}.pdf`);
    fs.createReadStream(pdfPath).pipe(res);
  } catch (err) {
    console.error("DOWNLOAD INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to download invoice" });
  }
};
