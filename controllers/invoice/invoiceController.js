import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import nodemailer from "nodemailer";
import Order from "../../models/shop/Order.model.js";
import { fileURLToPath } from "url";

/* ================= CONFIG ================= */

const GST_RATE = 18;
const COMPANY = "Astronexus Web Pvt Ltd";
const SUPPORT_EMAIL = "support@astronexus.com";
const WEBSITE = "https://astronexus.com";

const SOCIALS = [
  { label: "Website", url: WEBSITE },
  { label: "Instagram", url: "https://instagram.com/astronexus" },
  { label: "Support", url: `mailto:${SUPPORT_EMAIL}` },
];

const getOrderUrl = (id) => `${WEBSITE}/orders/${id}`;

/* ================= PATH ================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const invoiceFolder = path.join(__dirname, "../../invoices");
const uploadFolder = path.join(__dirname, "../../uploads");

if (!fs.existsSync(invoiceFolder)) fs.mkdirSync(invoiceFolder, { recursive: true });

const formatCurrency = (n) => `₹${Number(n).toFixed(2)}`;

/* ================= EMAIL ================= */

const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/* ================= GENERATE ================= */

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("items.product", "name price images")
      .populate("user", "fullName email")
      .populate("address");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const pdfPath = path.join(invoiceFolder, `${orderId}.pdf`);
    const orderUrl = getOrderUrl(orderId);

    const subtotal = order.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
    const gstAmount = (subtotal * GST_RATE) / 100;
    const grandTotal = subtotal + gstAmount;

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const centerX = pageWidth / 2;

    /* ================= HEADER ================= */

    const drawHeader = () => {
      doc.rect(0, 0, pageWidth, 8).fill("#0f3c5f");
      doc.fillColor("#0f3c5f").font("Helvetica-Bold").fontSize(22)
        .text("ASTRONEXUS", 40, 30);
      doc.fontSize(10).fillColor("#555")
        .text("Premium Astrology & Digital Products", 40, 55);
      doc.font("Helvetica-Bold").fontSize(18).fillColor("#000")
        .text("INVOICE", 0, 40, { align: "right" });
    };

    drawHeader();

    /* ================= META ================= */

    let y = 90;
    doc.rect(40, y, pageWidth - 80, 120).stroke("#dcdcdc");

    doc.fontSize(10).fillColor("#333");

    // BILL TO
    doc.font("Helvetica-Bold").text("Bill To:", 50, y + 10);
    doc.font("Helvetica")
      .text(order.user.fullName, 50, y + 25)
      .text(order.user.email, 50, y + 40);

    if (order.address) {
      doc.text(
        [
          order.address.line1,
          order.address.line2,
          `${order.address.city || ""} ${order.address.state || ""}`,
          order.address.zip,
        ]
          .filter(Boolean)
          .join(", "),
        50,
        y + 55,
        { width: 240 }
      );
    }

    // META RIGHT
    doc.font("Helvetica-Bold").text("Invoice ID:", 320, y + 10);
    doc.fillColor("#0f3c5f")
      .text(orderId, 400, y + 10, { link: orderUrl, underline: true });

    doc.fillColor("#333");
    doc.font("Helvetica-Bold").text("Date:", 320, y + 30);
    doc.font("Helvetica").text(new Date().toLocaleDateString(), 400, y + 30);

    doc.font("Helvetica-Bold").text("Status:", 320, y + 50);
    doc.font("Helvetica").text(order.status, 400, y + 50);

    /* ================= PRODUCTS ================= */

    let tableTop = y + 145;
    const col = { img: 50, name: 95, qty: 310, price: 370, total: 450 };

    const drawTableHeader = () => {
      doc.rect(40, tableTop, pageWidth - 80, 25).fill("#0f3c5f");
      doc.fillColor("#fff").font("Helvetica-Bold").fontSize(10)
        .text("Product", col.name, tableTop + 7)
        .text("Qty", col.qty, tableTop + 7)
        .text("Price", col.price, tableTop + 7)
        .text("Total", col.total, tableTop + 7);
      tableTop += 25;
      doc.fillColor("#000").font("Helvetica");
    };

    drawTableHeader();

    for (const item of order.items) {
      if (tableTop > pageHeight - 260) {
        doc.addPage();
        drawHeader();
        tableTop = 90;
        drawTableHeader();
      }

      doc.rect(40, tableTop, pageWidth - 80, 45).stroke("#e6e6e6");

      if (item.product?.images?.[0]) {
        const img = path.join(uploadFolder, item.product.images[0]);
        if (fs.existsSync(img)) {
          doc.image(img, col.img, tableTop + 5, { width: 35, height: 35 });
        }
      }

      doc.text(item.product.name, col.name, tableTop + 15, { width: 200 });
      doc.text(item.quantity, col.qty, tableTop + 15);
      doc.text(formatCurrency(item.price), col.price, tableTop + 15);
      doc.text(formatCurrency(item.price * item.quantity), col.total, tableTop + 15);

      tableTop += 45;
    }

    /* ================= TOTAL ================= */

    const boxX = centerX - 160;
    doc.rect(boxX, tableTop + 20, 320, 90).stroke("#0f3c5f");

    doc.font("Helvetica-Bold")
      .text("Subtotal", boxX + 20, tableTop + 35)
      .text(`GST (${GST_RATE}%)`, boxX + 20, tableTop + 55)
      .text("Grand Total", boxX + 20, tableTop + 75);

    doc.font("Helvetica")
      .text(formatCurrency(subtotal), boxX + 200, tableTop + 35)
      .text(formatCurrency(gstAmount), boxX + 200, tableTop + 55)
      .text(formatCurrency(grandTotal), boxX + 200, tableTop + 75);

    /* ================= QR ================= */

    const qr = await QRCode.toBuffer(orderUrl);
    doc.image(qr, centerX - 45, tableTop + 130, { width: 90 });

    doc.fillColor("#0f3c5f").fontSize(9)
      .text("View full order details",
        centerX - 70,
        tableTop + 230,
        { link: orderUrl, underline: true });

    /* ================= SOCIAL ================= */

    let socialY = tableTop + 260;
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#000")
      .text("Connect with us", 0, socialY, { align: "center" });

    let offset = -80;
    SOCIALS.forEach((s) => {
      doc.fillColor("#0f3c5f").fontSize(9)
        .text(
          s.label,
          centerX + offset,
          socialY + 20,
          { link: s.url, underline: true }
        );
      offset += 80;
    });

    /* ================= SIGNATURE ================= */

    doc.fillColor("#555").fontSize(8)
      .text(
        `Digitally signed by ${COMPANY}\nGenerated on ${new Date().toLocaleString()}`,
        0,
        pageHeight - 70,
        { align: "center" }
      );

    /* ================= FOOTER ================= */

    doc.rect(0, pageHeight - 20, pageWidth, 20).fill("#0f3c5f");
    doc.fillColor("#fff").fontSize(8)
      .text("Thank you for shopping with Astronexus", 0, pageHeight - 15, {
        align: "center",
      });

    doc.end();

    /* ================= EMAIL ================= */

    stream.on("finish", async () => {
      await mailer.sendMail({
        to: order.user.email,
        subject: "Your Astronexus Invoice",
        html: `
          <p>Hello ${order.user.fullName},</p>
          <p>Your invoice is attached.</p>
          <p><a href="${orderUrl}">View Order Online</a></p>
        `,
        attachments: [{ filename: `invoice-${orderId}.pdf`, path: pdfPath }],
      });

      res.json({
        success: true,
        previewUrl: `/api/invoice/preview/${orderId}`,
        downloadUrl: `/api/invoice/download/${orderId}`,
      });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Invoice failed" });
  }
};

/* ================= PREVIEW ================= */

export const previewInvoice = (req, res) => {
  const pdf = path.join(invoiceFolder, `${req.params.orderId}.pdf`);
  if (!fs.existsSync(pdf)) return res.status(404).end();
  res.setHeader("Content-Type", "application/pdf");
  fs.createReadStream(pdf).pipe(res);
};

/* ================= DOWNLOAD ================= */

export const downloadInvoice = (req, res) => {
  const pdf = path.join(invoiceFolder, `${req.params.orderId}.pdf`);
  if (!fs.existsSync(pdf)) return res.status(404).json({ message: "Not found" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${req.params.orderId}.pdf`);
  fs.createReadStream(pdf).pipe(res);
};
