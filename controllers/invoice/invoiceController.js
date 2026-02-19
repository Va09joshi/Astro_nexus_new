import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import Order from "../../models/shop/Order.model.js";

const invoiceFolder = path.join("invoices"); // invoices folder

// Ensure invoices folder exists
if (!fs.existsSync(invoiceFolder)) {
  fs.mkdirSync(invoiceFolder);
}

// Generate Invoice PDF after order is placed
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) return res.status(400).json({ message: "Order ID required" });

    const order = await Order.findById(orderId)
      .populate("items.product", "name price")
      .populate("user", "fullName email")
      .populate("address")
      .populate("paymentId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(pdfPath));

    // Header
    doc.fontSize(20).text("Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice ID: ${order._id}`);
    doc.text(`Order Status: ${order.status}`);
    doc.text(`Customer: ${order.user.fullName}`);
    doc.text(`Email: ${order.user.email}`);
    if (order.address)
      doc.text(
        `Address: ${order.address.line1}, ${order.address.city}, ${order.address.state}, ${order.address.zip}`
      );
    doc.moveDown();

    // Items table
    order.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item.product.name} - ${item.quantity} x ${item.price} = ${
          item.quantity * item.price
        }`
      );
    });

    doc.moveDown();
    doc.text(`Total Amount: $${order.totalAmount}`, { bold: true });
    doc.moveDown();

    // QR code pointing to order link
    const orderUrl = `http://localhost:5000/api/orders/${order._id}`;
    const qrDataUrl = await QRCode.toDataURL(orderUrl);

    const qrImage = qrDataUrl.replace(/^data:image\/png;base64,/, "");
    const qrBuffer = Buffer.from(qrImage, "base64");
    doc.image(qrBuffer, { fit: [100, 100], align: "right" });

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

// Download invoice PDF
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
