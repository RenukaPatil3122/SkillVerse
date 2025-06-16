import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Target,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Plus,
  Search,
} from "lucide-react";
import { api } from "../services/api";
import Footer from "../components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [location.pathname]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Redirecting to login...");
        navigate("/login");
        return;
      }
      setLoading(true);
      setError("");

      const userResponse = await api.get("/auth/me");
      setUser(userResponse.data.user || { name: "User" });

      const roadmapsResponse = await api.get("/roadmaps");
      const fetchedRoadmaps = Array.isArray(roadmapsResponse.data)
        ? roadmapsResponse.data
        : [];
      const normalizedRoadmaps = fetchedRoadmaps.map((roadmap) => ({
        ...roadmap,
        title: roadmap.title || "Untitled Roadmap",
        description: roadmap.description || "No description available",
        milestones: roadmap.milestones
          ? roadmap.milestones.map((m) => ({
              ...m,
              completed: m.completed ?? false,
            }))
          : [],
      }));
      setRoadmaps(normalizedRoadmaps);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard data. Check backend routes /api/auth/me and /api/roadmaps."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => fetchDashboardData();

  const filteredRoadmaps = roadmaps.filter(
    (roadmap) =>
      (roadmap.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (roadmap.description?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  const stats = {
    totalRoadmaps: roadmaps.length,
    completedRoadmaps: roadmaps.filter(
      (r) => r.milestones?.length > 0 && r.milestones.every((m) => m.completed)
    ).length,
    inProgressRoadmaps: roadmaps.filter(
      (r) =>
        r.milestones?.length > 0 &&
        r.milestones.some((m) => m.completed) &&
        !r.milestones.every((m) => m.completed)
    ).length,
    averageProgress:
      roadmaps.length > 0
        ? Math.round(
            roadmaps.reduce((total, roadmap) => {
              if (!roadmap.milestones || roadmap.milestones.length === 0)
                return total;
              const completedMilestones = roadmap.milestones.filter(
                (m) => m.completed
              ).length;
              return (
                total + (completedMilestones / roadmap.milestones.length) * 100
              );
            }, 0) / roadmaps.length
          )
        : 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Track your learning progress and manage your roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Roadmaps Created
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalRoadmaps}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Award className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.completedRoadmaps}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.inProgressRoadmaps}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageProgress}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/create-roadmap")}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" /> Create New Roadmap
            </button>
            <button
              onClick={() => navigate("/roadmaps")}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Search className="h-4 w-4 mr-2" /> Browse Roadmaps
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                My Roadmaps
              </h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search roadmaps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredRoadmaps.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No roadmaps found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {roadmaps.length === 0
                    ? "You haven't created any roadmaps yet. Start your learning journey!"
                    : "No roadmaps match your search criteria."}
                </p>
                {roadmaps.length === 0 && (
                  <button
                    onClick={() => navigate("/create-roadmap")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Your First Roadmap
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
                        {roadmap.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(roadmap.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {roadmap.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {roadmap.milestones?.length || 0} milestones
                      </span>
                      <button
                        onClick={() => navigate(`/roadmap/${roadmap._id}`)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                      >
                        Continue →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
