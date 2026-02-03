import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Admin from "../../models/admin.js";


// 🔑 ADMIN LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// create admin (for initial setup)
export const createAdmin = async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    // Check setup key
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({ message: "Not authorized to create admin" });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: { id: admin._id, email: admin.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// 🔁 UPDATE PASSWORD
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Old password and new password required",
      });
    }

    const admin = await Admin.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is wrong" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// 🚪 LOGOUT
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logout successful" });
};
