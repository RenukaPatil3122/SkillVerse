// API Base URL
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/users/profile",
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
  DELETE_ACCOUNT: "/users/delete-account",
};

// Roadmap endpoints
export const ROADMAP_ENDPOINTS = {
  CREATE: "/roadmaps",
  GET_ALL: "/roadmaps",
  GET_PUBLIC: "/roadmaps/public",
  GET_USER_ROADMAPS: "/roadmaps/user",
  GET_BY_ID: "/roadmaps/:id",
  UPDATE: "/roadmaps/:id",
  DELETE: "/roadmaps/:id",
  GENERATE_AI: "/roadmaps/generate-ai",
  UPDATE_PROGRESS: "/roadmaps/:id/progress",
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
  THEME: "theme",
  LANGUAGE: "language",
};

// Default values
export const DEFAULT_VALUES = {
  PAGINATION_LIMIT: 10,
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
};

// Roadmap categories
export const ROADMAP_CATEGORIES = [
  {
    id: "web-development",
    name: "Web Development",
    description: "Frontend and backend web technologies",
    color: "blue",
  },
  {
    id: "mobile-development",
    name: "Mobile Development",
    description: "iOS, Android, and cross-platform development",
    color: "green",
  },
  {
    id: "data-science",
    name: "Data Science",
    description: "Data analysis, visualization, and statistics",
    color: "purple",
  },
  {
    id: "ai-ml",
    name: "AI & Machine Learning",
    description: "Artificial intelligence and machine learning",
    color: "red",
  },
  {
    id: "devops",
    name: "DevOps",
    description: "Infrastructure, deployment, and automation",
    color: "orange",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    description: "Security practices and ethical hacking",
    color: "gray",
  },
  {
    id: "design",
    name: "Design",
    description: "UI/UX design and visual design",
    color: "pink",
  },
  {
    id: "business",
    name: "Business",
    description: "Business skills and entrepreneurship",
    color: "indigo",
  },
  {
    id: "programming",
    name: "Programming",
    description: "Programming languages and concepts",
    color: "yellow",
  },
  {
    id: "cloud",
    name: "Cloud Computing",
    description: "AWS, Azure, GCP, and cloud architecture",
    color: "teal",
  },
];

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  {
    id: "beginner",
    name: "Beginner",
    description: "No prior experience required",
    color: "green",
    estimatedTime: "1-3 months",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    description: "Some experience recommended",
    color: "yellow",
    estimatedTime: "3-6 months",
  },
  {
    id: "advanced",
    name: "Advanced",
    description: "Solid foundation required",
    color: "red",
    estimatedTime: "6+ months",
  },
];

// Step types
export const STEP_TYPES = {
  READING: "reading",
  VIDEO: "video",
  PRACTICE: "practice",
  PROJECT: "project",
  QUIZ: "quiz",
  ASSIGNMENT: "assignment",
};

// Progress status
export const PROGRESS_STATUS = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  SKIPPED: "skipped",
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input and try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  TOKEN_EXPIRED: "Your session has expired. Please log in again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
  PASSWORD_TOO_WEAK: "Password must be at least 8 characters long.",
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORDS_DONT_MATCH: "Passwords do not match.",
  FILE_TOO_LARGE: "File size must be less than 5MB.",
  UNSUPPORTED_FILE_TYPE: "Unsupported file type.",
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  REGISTER_SUCCESS: "Account created successfully!",
  LOGOUT_SUCCESS: "Successfully logged out!",
  PASSWORD_CHANGED: "Password changed successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
  ROADMAP_CREATED: "Roadmap created successfully!",
  ROADMAP_UPDATED: "Roadmap updated successfully!",
  ROADMAP_DELETED: "Roadmap deleted successfully!",
  PROGRESS_UPDATED: "Progress updated successfully!",
  EMAIL_SENT: "Email sent successfully!",
  PASSWORD_RESET: "Password reset successfully!",
};

// Validation rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
};

// Theme colors
export const THEME_COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
};

// Animation durations
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};

// Feature flags
export const FEATURE_FLAGS = {
  AI_GENERATION: process.env.REACT_APP_ENABLE_AI_GENERATION === "true",
  SOCIAL_AUTH: process.env.REACT_APP_ENABLE_SOCIAL_AUTH === "true",
  ANALYTICS: process.env.REACT_APP_ENABLE_ANALYTICS === "true",
  NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === "true",
};

// External links
export const EXTERNAL_LINKS = {
  GITHUB: "https://github.com/your-repo",
  DOCUMENTATION: "https://docs.yourapp.com",
  SUPPORT: "mailto:support@yourapp.com",
  PRIVACY_POLICY: "/privacy",
  TERMS_OF_SERVICE: "/terms",
  BLOG: "/blog",
};

// Social media links
export const SOCIAL_LINKS = {
  TWITTER: "https://twitter.com/yourapp",
  LINKEDIN: "https://linkedin.com/company/yourapp",
  FACEBOOK: "https://facebook.com/yourapp",
  INSTAGRAM: "https://instagram.com/yourapp",
};

// SEO defaults
export const SEO_DEFAULTS = {
  TITLE: "RoadmapAI - AI-Powered Learning Roadmaps",
  DESCRIPTION:
    "Create personalized learning roadmaps with AI assistance. Master any skill with structured, step-by-step guidance.",
  KEYWORDS: "learning, roadmap, AI, education, skills, technology, programming",
  AUTHOR: "RoadmapAI Team",
  IMAGE: "/og-image.png",
  URL: process.env.REACT_APP_BASE_URL || "http://localhost:3000",
};
