const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (userId, rememberMe = false) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  // If remember me is checked, token lasts 30 days, otherwise 7 days
  const expiresIn = rememberMe ? "30d" : "7d";

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

const registerUser = async (req, res) => {
  try {
    console.log("🔐 Registration request received:", {
      ...req.body,
      password: "[HIDDEN]",
    });

    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Trim and validate data
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required and cannot be empty",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      name: trimmedName,
      email: trimmedEmail,
      password, // Will be hashed by the pre-save middleware
    });

    const savedUser = await user.save();
    console.log("✅ User created successfully:", savedUser._id);

    // Generate token (default 7 days for registration)
    const token = generateToken(savedUser._id, false);

    // Return response without password
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: savedUser.toJSON(),
    });
  } catch (error) {
    console.error("❌ Register user error:", error);

    // Handle duplicate key error (11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field === "email" ? "Email" : field} already exists`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: errors,
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("🔐 Login request for email:", req.body.email);
    console.log("🔐 Remember me:", req.body.rememberMe);

    const { email, password, rememberMe } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      console.log("❌ User not found for email:", trimmedEmail);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", user._id);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("✅ Login successful for user:", user._id);

    if (rememberMe) {
      console.log("✅ Remember me enabled - generating 30-day token");
    }

    // Generate token with appropriate duration
    const token = generateToken(user._id, rememberMe);

    // Return response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
      tokenDuration: rememberMe ? "30 days" : "7 days",
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

const getMe = async (req, res) => {
  try {
    console.log("👤 Get me request for user:", req.user.id);

    // req.user is already populated by the auth middleware
    res.json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error("❌ Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
