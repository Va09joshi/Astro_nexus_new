const User = require("../../models/user");
const bcrypt = require("bcryptjs");

/**
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * POST /api/admin/users
 * Create user from admin panel
 */
const createUserByAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, role = "user" } = req.body;

    // Check duplicate email
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PATCH /api/admin/users/:id/block
 */
const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Prevent blocking admin or invalid user
    if (!user || user.role === "admin") {
      return res.status(403).json({ message: "Action not allowed" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      isBlocked: user.isBlocked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * DELETE /api/admin/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Prevent deleting admin
    if (!user || user.role === "admin") {
      return res.status(403).json({ message: "Action not allowed" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  createUserByAdmin,
  toggleUserBlock,
  deleteUser
};
