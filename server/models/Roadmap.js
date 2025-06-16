const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["frontend", "backend", "fullstack", "devops"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    // ✅ Fixed: Match your frontend usage
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    technologies: [
      {
        type: String,
      },
    ],
    // ✅ Added: Match your frontend expectations
    milestones: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
        },
      },
    ],
    // ✅ Added: Creator field for ownership
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // ✅ Kept existing fields
    modules: [
      {
        title: String,
        description: String,
        lessons: [
          {
            title: String,
            content: String,
            duration: Number,
            completed: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // ✅ Added: Useful metadata
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [String],
    estimatedDuration: {
      type: String, // e.g., "3 months", "6 weeks"
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Index for better query performance
roadmapSchema.index({ creator: 1, createdAt: -1 });
roadmapSchema.index({ type: 1, difficulty: 1 });
roadmapSchema.index({ isPublic: 1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);
