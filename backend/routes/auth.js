const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure correct path
const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    console.log("Processing signup for email:", email);

    try {
      const existingUser = await User.findOne({ email }).exec();
      console.log("Existing user check result:", existingUser);

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }
    } catch (findError) {
      console.error("Error checking existing user:", findError);
      return res
        .status(500)
        .json({ error: "Database error during user check" });
    }

    const user = new User({ email, password });

    try {
      await user.save();
      console.log("User saved successfully:", user._id);
    } catch (saveError) {
      if (saveError.code === 11000) {
        return res.status(400).json({ error: "Email already in use" });
      }
      throw saveError;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, userId: user._id });
  } catch (err) {
    console.error("Signup error:", err);
    res
      .status(500)
      .json({ error: "Error creating user", details: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
