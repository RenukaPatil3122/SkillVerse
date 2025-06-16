const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

// Get all posts
router.get("/posts", auth, async (req, res) => {
  try {
    console.log("Fetching posts for user:", req.user.id); // Debug log

    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    console.log(`Found ${posts.length} posts`); // Debug log
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get a single post by ID
router.get("/posts/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;

    // Validate ObjectId format
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(postId)
      .populate("author", "name email")
      .populate("comments.author", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Create a post
router.post("/posts", auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Post content cannot be empty" });
    }

    if (content.trim().length > 1000) {
      return res
        .status(400)
        .json({ message: "Post content too long (max 1000 characters)" });
    }

    console.log("Creating post for user:", req.user.id); // Debug log

    const newPost = new Post({
      content: content.trim(),
      author: req.user._id, // ✅ FIXED: Use req.user._id (ObjectId)
      likes: 0,
      likedBy: [],
    });

    const savedPost = await newPost.save();

    // Populate author info before sending response
    await savedPost.populate("author", "name email");

    console.log("Post created:", savedPost._id); // Debug log
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Like/Unlike a post
router.post("/posts/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;

    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user._id.toString(); // ✅ FIXED: Use _id and convert to string
    const hasLiked = post.likedBy.some((id) => id.toString() === userId);

    console.log("Like action:", { postId, userId, hasLiked }); // Debug log

    if (hasLiked) {
      // Unlike the post
      post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likedBy.push(req.user._id);
    }

    post.likes = post.likedBy.length;
    await post.save();

    res.json({
      message: hasLiked ? "Post unliked" : "Post liked",
      likes: post.likes,
      hasLiked: !hasLiked,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Delete a post - ✅ FIXED: Main issue was here
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;

    console.log("Delete request:", { postId, userId: req.user.id }); // Debug log

    // Validate ObjectId format
    if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid post ID format" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found:", postId);
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post author:", post.author.toString());
    console.log("Current user:", req.user._id.toString());

    // ✅ FIXED: Compare ObjectIds properly
    if (post.author.toString() !== req.user._id.toString()) {
      console.log("Access denied - not the author");
      return res.status(403).json({
        message: "Not authorized to delete this post",
      });
    }

    // ✅ FIXED: Use findByIdAndDelete instead of deprecated remove()
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post deleted successfully:", postId);
    res.json({
      message: "Post deleted successfully",
      deletedPostId: postId,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      message: "Error deleting post",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Get community stats
router.get("/stats", auth, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalUsers = await require("../models/User").countDocuments();

    res.json({
      totalMembers: totalUsers,
      onlineMembers: Math.floor(totalUsers * 0.1), // Mock online count
      totalPosts,
      activeToday: Math.floor(totalPosts * 0.05), // Mock active today
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
