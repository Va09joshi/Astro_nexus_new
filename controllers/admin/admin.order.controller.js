const Order = require("../../models/shop/Order.model");

exports.getAllOrders = async (req, res) => {
  res.json(await Order.find());
};

exports.updateStatus = async (req, res) => {
  res.json(
    await Order.findByIdAndUpdate(req.params.id,
      { orderStatus: req.body.status },
      { new: true }
    )
  );
};
