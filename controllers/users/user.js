// controllers/users/user.js
import bcrypt from "bcryptjs";
import validator from "validator";
import User from "../../models/user.js";
import { createToken } from "../../service/auth.js";

/**
 * User signup
 */
/* ======================================================
   1️⃣ BASIC SIGNUP
   Fields: name, phone, password, email(optional)
====================================================== */
export async function handleBasicSignup(req, res) {
  try {
    const { name, phone, password, confirmPassword, email } = req.body;

    if (!name || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: "Name, phone and password are required" });
    }

    if (!validator.isMobilePhone(phone, "any")) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with phone or email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword
    });

    const token = createToken(user);

    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(201).json({
      success: true,
      message: "Basic signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Basic Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


/* ======================================================
   2️⃣ ASTROLOGY SIGNUP (FULL PROFILE)
   Fields: All basic + DOB, Time, Place
====================================================== */
export async function handleAstrologySignup(req, res) {
  try {
    const {
      name,
      phone,
      password,
      confirmPassword,
      email,
      dateOfBirth,
      timeOfBirth,
      placeOfBirth
    } = req.body;

    if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: "Astrology birth details are required" });
    }

    let user = await User.findOne({ $or: [{ phone }, { email }] }).select("+password");

    // 🟢 CASE 1: USER EXISTS → JUST UPDATE ASTROLOGY DATA
    if (user) {
      user.astrologyProfile = {
        dateOfBirth,
        timeOfBirth,
        placeOfBirth
      };

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Astrology profile added successfully",
        user: {
          id: user._id,
          name: user.name,
          astrologyProfile: user.astrologyProfile
        }
      });
    }

    // 🔵 CASE 2: NEW USER → CREATE FULL ACCOUNT
    if (!name || !phone || !password || !confirmPassword) {
      return res.status(400).json({ error: "Basic signup details are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      astrologyProfile: {
        dateOfBirth,
        timeOfBirth,
        placeOfBirth
      }
    });

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: "User created with astrology profile",
      token
    });

  } catch (error) {
    console.error("Astrology Signup Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * User login
 */
export async function handleUserLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Include password field explicitly because select: false in schema
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ error: "This account is blocked" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
        role: user.role,
        isBlocked: user.isBlocked,
        lastLoginAt: user.lastLoginAt,
      },
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
  return res.json({ success: true, message: "Logged out successfully" });
}
