// controllers/users/payment.controller.js
import Payment from "../../models/shop/Payment.model.js";

/**
 * CREATE PAYMENT
 */
export const createPayment = async (req, res) => {
  try {
    const { amount } = req.body;

    const payment = await Payment.create({
      user: req.user.id,
      amount,
      status: "pending",
    });

    res.json(payment);
  } catch (error) {
    console.error("CREATE PAYMENT ERROR:", error);
    res.status(500).json({ message: "Failed to create payment" });
  }
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.body.paymentId);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.status = "success";
    await payment.save();

    res.json(payment);
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Failed to verify payment" });
  }
};
