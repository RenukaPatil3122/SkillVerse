const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Reuse existing models if registered, else define lightweight versions
const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema(
      { name: String, email: String, password: String },
      { timestamps: true },
    ),
  );

const Roadmap =
  mongoose.models.Roadmap ||
  mongoose.model(
    "Roadmap",
    new mongoose.Schema(
      {
        title: String,
        description: String,
        category: String,
        isPublic: Boolean,
      },
      { timestamps: true },
    ),
  );

// GET /api/stats
router.get("/", async (req, res) => {
  try {
    const [userCount, roadmapCount] = await Promise.all([
      User.countDocuments(),
      Roadmap.countDocuments({ isPublic: true }),
    ]);

    res.json({
      success: true,
      stats: {
        users: userCount,
        roadmaps: roadmapCount,
      },
    });
  } catch (err) {
    console.error("Stats error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
});

module.exports = router;
