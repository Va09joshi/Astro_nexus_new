// controllers/users/user.js
import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../../models/user.js";
import { createToken } from "../../service/auth.js";
import { getCoordinatesFromPlace } from "../../service/geocode.js";

/**
 * User signup
 */
export async function handleUserSignup(req, res) {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
      timezone
    } = req.body;

    // 1️⃣ Validation
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !dateOfBirth ||
      !timeOfBirth ||
      !placeOfBirth ||
      timezone === undefined
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long"
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Convert place → lat/long
    const { latitude, longitude } = await getCoordinatesFromPlace(placeOfBirth);

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      birthDetails: {
        date: new Date(dateOfBirth),
        time: timeOfBirth,
        place: placeOfBirth,
        latitude,
        longitude,
        timezone
      }
    });

    // 5️⃣ Create token
    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthDetails: user.birthDetails
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

/**
 * User login
 */
export async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.password) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password"
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        birthDetails: user.birthDetails
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * User logout
 */
export async function handleUserLogout(req, res) {
  res.clearCookie("token");
  return res.json({
    success: true,
    message: "Logged out successfully"
  });
}
