const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/database");

// Import routes
const authRoutes = require("./routes/auth");
const roadmapRoutes = require("./routes/roadmaps");
const communityRoutes = require("./routes/community");

const app = express();

// ✅ FIXED CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://skillverse-kappa.vercel.app",
  "https://skillverse-git-main-renukas-projects-64d87f3a.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

console.log("🔧 Allowed CORS Origins:", allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        console.log("✅ Request with no origin allowed");
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        console.log(`✅ CORS allowed for origin: ${origin}`);
        callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        console.log(`📝 Allowed origins: ${allowedOrigins.join(", ")}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
    exposedHeaders: ["Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

// ✅ Essential Middleware - in correct order
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Request Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  console.log(`Origin: ${req.headers.origin || "No origin"}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const logBody = { ...req.body };
    if (logBody.password) logBody.password = "[HIDDEN]";
    console.log("Request Body:", logBody);
  }
  next();
});

// ✅ Connect to MongoDB
connectDB();

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "SkillVerse API Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    allowedOrigins: allowedOrigins,
    endpoints: {
      health: "/api/health",
      auth: "/api/auth/*",
      roadmaps: "/api/roadmaps/*",
      community: "/api/community/*",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    database: "Connected",
    environment: process.env.NODE_ENV || "development",
    corsOrigins: allowedOrigins,
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/community", communityRoutes);

// ✅ Test Route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "All routes connected successfully!",
    routes: [
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/me",
      "GET /api/roadmaps",
      "GET /api/community",
    ],
  });
});

// ✅ 404 Handler for API routes
app.use("/api/*", (req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `API route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/me",
    ],
  });
});

// ✅ Global Error Handler
app.use((error, req, res, next) => {
  console.error("❌ Global error handler:", error);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
      origin: req.headers.origin,
      allowedOrigins: allowedOrigins,
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  if (error.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired",
    });
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
      error: error,
    }),
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("🚀=================================🚀");
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Allowed Origins: ${allowedOrigins.join(", ")}`);
  console.log("🚀=================================🚀");
});

// ✅ Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Process terminated");
  });
});

module.exports = app;
