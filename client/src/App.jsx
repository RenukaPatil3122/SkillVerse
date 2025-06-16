import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Roadmaps from "./pages/Roadmaps";
import Community from "./pages/Community";
// ✅ Add these imports for missing routes
import CreateRoadmap from "./pages/CreateRoadmap";
import EditRoadmap from "./pages/EditRoadmap";
import RoadmapDetail from "./pages/RoadmapDetail";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors">
            <Navbar />
            <Routes>
              {/* ✅ Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ✅ Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmaps"
                element={
                  <ProtectedRoute>
                    <Roadmaps />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-roadmap"
                element={
                  <ProtectedRoute>
                    <CreateRoadmap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-roadmap/:id"
                element={
                  <ProtectedRoute>
                    <EditRoadmap />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap/:id"
                element={
                  <ProtectedRoute>
                    <RoadmapDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* Added Community Route */}
              <Route
                path="/community"
                element={
                  <ProtectedRoute>
                    <Community />
                  </ProtectedRoute>
                }
              />

              {/* ✅ Catch all route for 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        404 - Page Not Found
                      </h1>
                      <p className="text-gray-600 dark:text-gray-300 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a
                        href="/"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
