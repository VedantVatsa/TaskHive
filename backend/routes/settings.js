const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// GET /api/settings - Get all settings
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json({
      theme: user.theme || "light",
      language: user.language || "en",
      timezone: user.timezone || "UTC",
      notifications: user.notifications || {
        email: true,
        push: true,
        sound: true,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching settings" });
  }
});

// PATCH /api/settings/profile
router.patch("/profile", auth, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, avatar } },
      { new: true }
    ).select("-password");

    res.json({ name: user.name, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
});

// PATCH /api/settings/notifications
router.patch("/notifications", auth, async (req, res) => {
  try {
    const { notifications } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { notifications } },
      { new: true }
    ).select("-password");

    res.json({ notifications: user.notifications });
  } catch (error) {
    res.status(500).json({ error: "Error updating notification settings" });
  }
});

// PATCH /api/settings/region
router.patch("/region", auth, async (req, res) => {
  try {
    const { language, timezone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { language, timezone } },
      { new: true }
    ).select("-password");

    res.json({ language: user.language, timezone: user.timezone });
  } catch (error) {
    res.status(500).json({ error: "Error updating region settings" });
  }
});

// PATCH /api/settings/appearance
router.patch("/appearance", auth, async (req, res) => {
  try {
    const { theme } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { theme } },
      { new: true }
    ).select("-password");

    res.json({ theme: user.theme });
  } catch (error) {
    res.status(500).json({ error: "Error updating appearance settings" });
  }
});

module.exports = router;
