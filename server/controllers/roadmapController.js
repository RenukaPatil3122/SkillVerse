const Roadmap = require("../models/Roadmap");
const User = require("../models/User");

// Get all public roadmaps
const getAllRoadmaps = async (req, res) => {
  try {
    const { type, difficulty, search, limit = 20 } = req.query;
    let query = { isPublic: true };

    // Add filters
    if (type && type !== "all") {
      query.type = type;
    }
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    console.log("Browse query:", query); // Debug log

    const roadmaps = await Roadmap.find(query)
      .populate("creator", "name email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    console.log(`Found ${roadmaps.length} public roadmaps`); // Debug log
    res.json(roadmaps);
  } catch (error) {
    console.error("Get all roadmaps error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get current user's roadmaps
const getUserRoadmaps = async (req, res) => {
  try {
    console.log("Getting roadmaps for user:", req.user.id); // Debug log

    // ✅ FIXED: Use req.user._id for ObjectId comparison
    const roadmaps = await Roadmap.find({ creator: req.user._id })
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    console.log("Found roadmaps:", roadmaps.length); // Debug log
    res.json(roadmaps);
  } catch (error) {
    console.error("Get user roadmaps error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get single roadmap by ID
const getRoadmapById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid roadmap ID format" });
    }

    const roadmap = await Roadmap.findById(id)
      .populate("creator", "name email")
      .populate("reviews.user", "name");

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Check if user has access (public roadmap or owner)
    const isOwner =
      req.user && roadmap.creator._id.toString() === req.user._id.toString();

    if (!roadmap.isPublic && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(roadmap);
  } catch (error) {
    console.error("Get roadmap by ID error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid roadmap ID" });
    }
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Create new roadmap
const createRoadmap = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      difficulty,
      technologies,
      milestones,
      modules,
      isPublic,
      tags,
      estimatedDuration,
    } = req.body;

    // Enhanced validation
    if (!title?.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: "Description is required" });
    }
    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }
    if (!category?.trim()) {
      return res.status(400).json({ message: "Category is required" });
    }
    if (!difficulty) {
      return res.status(400).json({ message: "Difficulty is required" });
    }

    console.log("Creating roadmap with data:", {
      title: title.trim(),
      type,
      difficulty,
      creator: req.user.id,
    }); // Debug log

    const roadmap = new Roadmap({
      title: title.trim(),
      description: description.trim(),
      type,
      category: category.trim(),
      difficulty,
      technologies: technologies || [],
      milestones: milestones || [],
      modules: modules || [],
      creator: req.user._id, // ✅ FIXED: Use req.user._id
      isPublic: isPublic !== undefined ? isPublic : true,
      tags: tags || [],
      estimatedDuration: estimatedDuration || "",
    });

    const savedRoadmap = await roadmap.save();
    await savedRoadmap.populate("creator", "name email");

    console.log("Roadmap created successfully:", savedRoadmap._id); // Debug log
    res.status(201).json(savedRoadmap);
  } catch (error) {
    console.error("Create roadmap error:", error);
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Update roadmap
const updateRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid roadmap ID format" });
    }

    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // ✅ FIXED: Check ownership properly
    if (roadmap.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedUpdates = [
      "title",
      "description",
      "type",
      "category",
      "difficulty",
      "technologies",
      "milestones",
      "modules",
      "isPublic",
      "tags",
      "estimatedDuration",
      "progress",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // Trim string fields
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.category) updates.category = updates.category.trim();

    const updatedRoadmap = await Roadmap.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("creator", "name email");

    console.log("Roadmap updated:", updatedRoadmap._id); // Debug log
    res.json(updatedRoadmap);
  } catch (error) {
    console.error("Update roadmap error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid roadmap ID" });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Delete roadmap - ✅ FIXED: This was also causing issues
const deleteRoadmap = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Attempting to delete roadmap:", id); // Debug log
    console.log("User ID:", req.user.id); // Debug log

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid roadmap ID format" });
    }

    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      console.log("Roadmap not found");
      return res.status(404).json({ message: "Roadmap not found" });
    }

    console.log("Roadmap creator:", roadmap.creator.toString()); // Debug log
    console.log("Current user:", req.user._id.toString()); // Debug log

    // ✅ FIXED: Check ownership properly
    if (roadmap.creator.toString() !== req.user._id.toString()) {
      console.log("Access denied - not owner");
      return res.status(403).json({
        message: "Access denied - You can only delete your own roadmaps",
      });
    }

    // ✅ FIXED: Use findByIdAndDelete instead of remove (deprecated)
    const deletedRoadmap = await Roadmap.findByIdAndDelete(id);

    if (!deletedRoadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    console.log("Roadmap deleted successfully"); // Debug log
    res.json({
      message: "Roadmap deleted successfully",
      deletedRoadmapId: id,
    });
  } catch (error) {
    console.error("Delete roadmap error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid roadmap ID" });
    }
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Seed sample roadmaps
const seedRoadmaps = async (req, res) => {
  try {
    console.log("Seeding roadmaps for user:", req.user.id); // Debug log

    const sampleRoadmaps = [
      {
        title: "React Frontend Development",
        description: "Complete guide to becoming a React developer",
        type: "frontend",
        category: "Web Development",
        difficulty: "intermediate",
        technologies: ["React", "JavaScript", "HTML", "CSS", "Redux"],
        creator: req.user._id, // ✅ FIXED: Use req.user._id
        milestones: [
          {
            title: "Learn JavaScript Fundamentals",
            description: "Master ES6+ features and async programming",
          },
          {
            title: "React Basics",
            description: "Components, props, state, and lifecycle",
          },
          {
            title: "State Management",
            description: "Redux, Context API, and hooks",
          },
        ],
        modules: [
          {
            title: "JavaScript Fundamentals",
            description: "Core concepts and modern features",
            lessons: [
              {
                title: "Variables and Functions",
                content: "Learn about let, const, arrow functions",
                duration: 120,
              },
            ],
          },
        ],
        tags: ["react", "javascript", "frontend"],
        estimatedDuration: "3 months",
        isPublic: true,
      },
      {
        title: "Node.js Backend Development",
        description: "Building scalable backend applications with Node.js",
        type: "backend",
        category: "Server Development",
        difficulty: "intermediate",
        technologies: ["Node.js", "Express", "MongoDB", "JWT"],
        creator: req.user._id, // ✅ FIXED: Use req.user._id
        milestones: [
          {
            title: "Node.js Basics",
            description: "Understanding runtime and core modules",
          },
          {
            title: "Express Framework",
            description: "Building REST APIs with Express",
          },
          {
            title: "Database Integration",
            description: "Working with MongoDB and Mongoose",
          },
        ],
        tags: ["nodejs", "backend", "api"],
        estimatedDuration: "4 months",
        isPublic: true,
      },
      {
        title: "Full Stack Development",
        description:
          "Combine frontend and backend skills for complete web applications",
        type: "fullstack",
        category: "Web Development",
        difficulty: "advanced",
        technologies: ["React", "Node.js", "MongoDB", "Express"],
        creator: req.user._id, // ✅ FIXED: Use req.user._id
        milestones: [
          {
            title: "Frontend Mastery",
            description: "Advanced React patterns and state management",
          },
          {
            title: "Backend Integration",
            description: "API design and database optimization",
          },
          {
            title: "Deployment",
            description: "Full stack deployment strategies",
          },
        ],
        tags: ["fullstack", "react", "nodejs"],
        estimatedDuration: "6 months",
        isPublic: true,
      },
    ];

    // Delete existing sample roadmaps for this user to avoid duplicates
    await Roadmap.deleteMany({
      creator: req.user._id, // ✅ FIXED: Use req.user._id
      title: { $in: sampleRoadmaps.map((r) => r.title) },
    });

    const createdRoadmaps = await Roadmap.insertMany(sampleRoadmaps);
    const populatedRoadmaps = await Roadmap.find({
      _id: { $in: createdRoadmaps.map((r) => r._id) },
    }).populate("creator", "name email");

    console.log("Created roadmaps:", populatedRoadmaps.length); // Debug log

    res.status(201).json({
      message: "Sample roadmaps created successfully",
      roadmaps: populatedRoadmaps,
    });
  } catch (error) {
    console.error("Seed roadmaps error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getAllRoadmaps,
  getUserRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  seedRoadmaps,
};
