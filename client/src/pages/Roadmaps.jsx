import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaCalendar,
  FaUser,
  FaCode,
  FaDatabase,
  FaLayerGroup,
  FaCloud,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const response = await api.get("/roadmaps");
      setRoadmaps(response.data);
      setError("");
    } catch (err) {
      console.error("Fetch roadmaps error:", err.response || err);
      if (err.response?.status === 401) {
        setError("Please log in to view your roadmaps");
      } else if (err.response?.status === 403) {
        setError("Access denied");
      } else {
        setError(err.response?.data?.message || "Failed to fetch roadmaps");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteRoadmap = async (id) => {
    if (window.confirm("Are you sure you want to delete this roadmap?")) {
      try {
        await api.delete(`/roadmaps/${id}`);
        setRoadmaps(roadmaps.filter((roadmap) => roadmap._id !== id));
        setError("");
      } catch (err) {
        console.error("Delete roadmap error:", err.response || err);
        setError(err.response?.data?.message || "Failed to delete roadmap");
      }
    }
  };

  const seedSampleRoadmaps = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.post("/roadmaps/seed");
      if (response.data.roadmaps) {
        setRoadmaps(response.data.roadmaps);
      } else {
        await fetchRoadmaps();
      }
    } catch (err) {
      console.error("Seed roadmaps error:", err.response || err);
      setError(
        err.response?.data?.message || "Failed to create sample roadmaps"
      );
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      frontend: FaCode,
      backend: FaDatabase,
      fullstack: FaLayerGroup,
      devops: FaCloud,
    };
    const Icon = icons[type] || FaCode;
    return <Icon className="text-lg" />;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Roadmaps
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your learning roadmaps
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={seedSampleRoadmaps}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Add Samples"}
            </button>
            <Link
              to="/create-roadmap"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaPlus /> Create New Roadmap
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {roadmaps.length === 0 && !error ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
              📚
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No roadmaps yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Create your first learning roadmap to get started
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={seedSampleRoadmaps}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Add Sample Roadmaps"}
              </button>
              <Link
                to="/create-roadmap"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
              >
                <FaPlus /> Create Your First Roadmap
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <div
                key={roadmap._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70 transition-shadow p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                      {getTypeIcon(roadmap.type)}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {roadmap.title}
                    </h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link
                      to={`/roadmap/${roadmap._id}`}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
                      title="View Roadmap"
                    >
                      <FaEye />
                    </Link>
                    <Link
                      to={`/edit-roadmap/${roadmap._id}`}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1"
                      title="Edit Roadmap"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => deleteRoadmap(roadmap._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                      title="Delete Roadmap"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {roadmap.description}
                </p>

                {roadmap.technologies && roadmap.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {roadmap.technologies.slice(0, 3).map((tech, index) => (
                      <span
                        key={index}
                        className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {roadmap.technologies.length > 3 && (
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{roadmap.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <FaCalendar />
                    <span>
                      {new Date(roadmap.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUser />
                    <span>{roadmap.creator?.name || user?.name || "You"}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {roadmap.milestones?.length || 0}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {" "}
                      milestones
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(
                        roadmap.difficulty
                      )}`}
                    >
                      {roadmap.difficulty}
                    </span>
                  </div>
                </div>

                {roadmap.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progress
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {roadmap.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${roadmap.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmaps;
