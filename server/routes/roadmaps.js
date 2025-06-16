const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllRoadmaps,
  getUserRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  seedRoadmaps,
} = require("../controllers/roadmapController");

// Add logging middleware for this router
router.use((req, res, next) => {
  console.log(`🛣️  Roadmap route: ${req.method} ${req.path}`);
  next();
});

// Test route to verify roadmap routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Roadmap routes are working!" });
});

// Get all public roadmaps (for browsing)
router.get("/browse", getAllRoadmaps);

// Seed sample roadmaps (for testing) - MUST be before /:id route
router.post("/seed", auth, seedRoadmaps);

// Get user's roadmaps (created by user) - Main route for dashboard
router.get("/", auth, getUserRoadmaps);

// Create new roadmap
router.post("/", auth, createRoadmap);

// Get single roadmap by ID - MUST be after specific routes
router.get("/:id", auth, getRoadmapById);

// Update roadmap
router.put("/:id", auth, updateRoadmap);

// Delete roadmap
router.delete("/:id", auth, deleteRoadmap);

module.exports = router;
