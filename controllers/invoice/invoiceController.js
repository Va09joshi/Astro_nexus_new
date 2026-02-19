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
      doc.image(logoPath, 50, 45, { width: 80 });
    }

    // Colored header background
    doc.rect(0, 20, doc.page.width, 50).fill("#4a90e2").stroke();
    doc.fillColor("#fff").fontSize(24).text("ASTRONEXUS INVOICE", 0, 35, {
      align: "center",
    });

    doc.moveDown(3);

    // ================= ORDER & CUSTOMER INFO =================
    doc.fillColor("#333").fontSize(10);
    const customerInfo = `
Invoice ID: ${order._id}
Order Status: ${order.status}
Date: ${new Date().toLocaleDateString()}

Customer: ${order.user.fullName}
Email: ${order.user.email}
${order.address ? `Address: ${order.address.line1}, ${order.address.city}, ${order.address.state}, ${order.address.zip}` : ""}
    `;
    doc.text(customerInfo, { align: "center" }).moveDown(2);

    // ================= PRODUCTS TABLE =================
    const tableTop = doc.y;
    const itemMargin = 10;

    // Table Header
    const headers = ["Product", "Qty", "Price", "Total"];
    const headerX = [50, 250, 320, 400];
    doc.fillColor("#000").fontSize(12).font("Helvetica-Bold");
    headers.forEach((header, i) => {
      doc.text(header, headerX[i], tableTop, { align: "center" });
    });

    let y = tableTop + 25;
    doc.font("Helvetica").fontSize(10);

    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];

      // Alternating row background
      if (i % 2 === 0) {
        doc.rect(50, y - 5, doc.page.width - 100, 40).fill("#f0f0f0").fillColor("#000");
      }

      // Product image
      if (item.product.images && item.product.images[0]) {
        try {
          const imgPath = path.join("uploads", item.product.images[0]);
          if (fs.existsSync(imgPath)) {
            doc.image(imgPath, 50, y - 5, { width: 40, height: 40 });
          }
        } catch (err) {
          console.error("Image load error:", err);
        }
      }

      doc.text(item.product.name, 100, y, { width: 150, align: "center" });
      doc.text(item.quantity, 250, y, { width: 50, align: "center" });
      doc.text(`$${item.price}`, 320, y, { width: 60, align: "center" });
      doc.text(`$${item.price * item.quantity}`, 400, y, { width: 60, align: "center" });

      y += 45;
    }

    // ================= TOTAL =================
    doc.moveDown(2);
    doc
      .fillColor("#4a90e2")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(`Total Amount: $${order.totalAmount}`, { align: "center" })
      .moveDown(2);

    // ================= QR CODE =================
    const orderUrl = `https://astro-nexus-new-6.onrender.com/user/orders/${order._id}`;
    const qrDataUrl = await QRCode.toDataURL(orderUrl);
    const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrImage, "base64");

    doc.image(qrBuffer, doc.page.width / 2 - 50, doc.y, { fit: [100, 100], align: "center" });
    doc.fontSize(10).fillColor("#333").text("Scan to view order details", doc.page.width / 2 - 55, doc.y + 105, { align: "center" });

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

    if (!fs.existsSync(pdfPath))
      return res.status(404).json({ message: "Invoice not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${orderId}.pdf`);
    fs.createReadStream(pdfPath).pipe(res);
  } catch (err) {
    console.error("DOWNLOAD INVOICE ERROR:", err);
    res.status(500).json({ message: "Failed to download invoice" });
  }
};
