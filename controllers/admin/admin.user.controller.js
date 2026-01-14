import User from "../../models/user.js";

// GET /admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /admin/users/:id/block
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role === "admin") {
      return res.status(403).json({ message: "Action not allowed" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ success: true, isBlocked: user.isBlocked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
