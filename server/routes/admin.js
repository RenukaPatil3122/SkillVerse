const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// ── Reuse or define models ────────────────────────────────────────────────────

const User =
  mongoose.models.User ||
  mongoose.model(
    "User",
    new mongoose.Schema({ name: String, email: String }, { timestamps: true }),
  );

const Roadmap =
  mongoose.models.Roadmap ||
  mongoose.model(
    "Roadmap",
    new mongoose.Schema(
      {
        title: String,
        category: String,
        description: String,
        isPublic: Boolean,
        createdBy: mongoose.Schema.Types.ObjectId,
      },
      { timestamps: true },
    ),
  );

const Post =
  mongoose.models.Post ||
  mongoose.model(
    "Post",
    new mongoose.Schema(
      {
        content: String,
        author: mongoose.Schema.Types.ObjectId,
        title: String,
      },
      { timestamps: true },
    ),
  );

// ── Simple password middleware ────────────────────────────────────────────────
// Change this password to whatever you want!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "skillverse@admin2024";

function adminAuth(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

// ── POST /api/admin/login ─────────────────────────────────────────────────────
router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_PASSWORD });
  } else {
    res.status(401).json({ success: false, message: "Wrong password" });
  }
});

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const last7 = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalRoadmaps,
      newUsersThisWeek,
      newUsersThisMonth,
      newRoadmapsThisWeek,
      recentUsers,
      recentRoadmaps,
      totalPosts,
    ] = await Promise.all([
      User.countDocuments(),
      Roadmap.countDocuments(),
      User.countDocuments({ createdAt: { $gte: last7 } }),
      User.countDocuments({ createdAt: { $gte: last30 } }),
      Roadmap.countDocuments({ createdAt: { $gte: last7 } }),
      User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("name email createdAt"),
      Roadmap.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("title category createdAt isPublic"),
      Post.countDocuments().catch(() => 0), // graceful if no Post model
    ]);

    // User growth — last 7 days breakdown
    const userGrowth = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(dayStart.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const count = await User.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      userGrowth.push({
        date: dayStart.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
        }),
        count,
      });
    }

    // Roadmaps by category
    const categoryAgg = await Roadmap.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          roadmaps: totalRoadmaps,
          posts: totalPosts,
        },
        growth: {
          newUsersWeek: newUsersThisWeek,
          newUsersMonth: newUsersThisMonth,
          newRoadmapsWeek: newRoadmapsThisWeek,
        },
        recentUsers,
        recentRoadmaps,
        userGrowth,
        roadmapsByCategory: categoryAgg,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin stats" });
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete("/users/:id", adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/admin/roadmaps/:id ────────────────────────────────────────────
router.delete("/roadmaps/:id", adminAuth, async (req, res) => {
  try {
    await Roadmap.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Roadmap deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
