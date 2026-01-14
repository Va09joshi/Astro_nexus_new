const User = require("../../models/user");

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

exports.toggleUserBlock = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user || user.role === "admin") {
    return res.status(403).json({ message: "Action not allowed" });
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ success: true, isBlocked: user.isBlocked });
};
