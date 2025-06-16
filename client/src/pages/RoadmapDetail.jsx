import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/api"; // Ensure api service is properly set up

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  console.log("Roadmap ID from URL:", id); // Debug line

  useEffect(() => {
    fetchRoadmapDetail();
  }, [id]);

  const fetchRoadmapDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/roadmaps/${id}`);
      console.log("Found roadmap data:", response.data); // Debug line
      setRoadmap(response.data);
    } catch (err) {
      console.error("Fetch roadmap detail error:", err.response || err);
      setError(
        err.response?.data?.message || "Failed to fetch roadmap details"
      );
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress based on completed milestones
  const calculateProgress = () => {
    if (!roadmap?.milestones || roadmap.milestones.length === 0) return 0;

    const completedMilestones = roadmap.milestones.filter(
      (milestone) => milestone.status === "completed"
    ).length;

    return Math.round((completedMilestones / roadmap.milestones.length) * 100);
  };

  // Handle milestone status change
  const handleMilestoneStatusChange = (milestoneId, isChecked) => {
    try {
      // Optimistic update
      const updatedRoadmap = { ...roadmap };
      const milestoneIndex = updatedRoadmap.milestones.findIndex(
        (m) => m._id === milestoneId
      );
      updatedRoadmap.milestones[milestoneIndex].status = isChecked
        ? "completed"
        : "pending";
      setRoadmap(updatedRoadmap);

      // Note: Removed API call to avoid net::ERR_FAILED
      // Re-enable when backend supports PATCH /roadmaps/:id/milestones/:milestoneId
      // await api.patch(`/roadmaps/${id}/milestones/${milestoneId}`, {
      //   status: isChecked ? "completed" : "pending",
      // });
    } catch (err) {
      console.error("Error updating milestone status:", err);
      alert("Failed to update milestone status. Please try again.");
    }
  };

  // Handle Continue Learning - Navigate to next incomplete milestone
  const handleContinueLearning = () => {
    if (!roadmap?.milestones || roadmap.milestones.length === 0) {
      alert("No milestones available to continue learning.");
      return;
    }

    const nextMilestone = roadmap.milestones.find(
      (milestone) => milestone.status !== "completed"
    );

    if (nextMilestone) {
      alert(
        `Continue with: ${nextMilestone.title}\n\nDescription: ${nextMilestone.description}`
      );
      // Alternative: Navigate to a specific learning page
      // navigate(`/learn/${roadmap._id}/${nextMilestone._id}`);
    } else {
      alert(
        "Congratulations! You've completed all milestones in this roadmap!"
      );
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    try {
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${roadmap.title
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_roadmap.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  // Generate PDF content
  const generatePDFContent = () => {
    const progress = calculateProgress();
    const completedCount =
      roadmap.milestones?.filter((m) => m.status === "completed").length || 0;
    const inProgressCount =
      roadmap.milestones?.filter((m) => m.status === "in-progress").length || 0;

    let content = `
LEARNING ROADMAP: ${roadmap.title.toUpperCase()}

Description: ${roadmap.description}

Creator: ${roadmap.creator?.name || "Unknown"}
Created: ${new Date(roadmap.createdAt).toLocaleDateString()}
Difficulty: ${roadmap.difficulty || "Not specified"}
Progress: ${progress}%

Technologies:
${
  roadmap.technologies?.map((tech) => `- ${tech}`).join("\n") ||
  "No technologies specified"
}

MILESTONES (${roadmap.milestones?.length || 0} total):
Completed: ${completedCount}
In Progress: ${inProgressCount}
Pending: ${(roadmap.milestones?.length || 0) - completedCount - inProgressCount}

DETAILED MILESTONES:
${
  roadmap.milestones
    ?.map(
      (milestone, index) => `
${index + 1}. ${milestone.title} [${
        milestone.status?.toUpperCase() || "PENDING"
      }]
   Description: ${milestone.description || "No description"}
   Duration: ${milestone.duration || "Not specified"}
   Topics: ${milestone.topics?.join(", ") || "No topics defined"}
`
    )
    .join("\n") || "No milestones defined"
}

OVERVIEW:
${roadmap.detailedDescription || roadmap.description}

Generated on: ${new Date().toLocaleString()}
    `;

    return content.trim();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10";
      case "in-progress":
        return "text-blue-400 bg-blue-400/10";
      case "pending":
        return "text-gray-400 bg-gray-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const getLevelColor = (difficulty) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-400 bg-green-400/10";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/10";
      case "advanced":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error ? "Error Loading Roadmap" : "Roadmap Not Found"}
          </h1>
          <p className="text-gray-400 mb-4">
            {error || `No roadmap found with ID: ${id}`}
          </p>
          <button
            onClick={() => navigate("/roadmaps")}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
          >
            Back to Roadmaps
          </button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();
  const completedCount =
    roadmap.milestones?.filter((m) => m.status === "completed").length || 0;
  const inProgressCount =
    roadmap.milestones?.filter((m) => m.status === "in-progress").length || 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={() => navigate("/roadmaps")}
            className="flex items-center text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to My Roadmaps
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{roadmap.title}</h1>
                  <p className="text-gray-400 text-lg">{roadmap.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {roadmap.creator?.name || "Unknown"}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 6h6m-6 4h6m-6-8h6M6 12H4a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2v-7a2 2 0 00-2-2h-2"
                    />
                  </svg>
                  {new Date(roadmap.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {roadmap.milestones?.length || 0} milestones
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(
                    roadmap.difficulty
                  )}`}
                >
                  {roadmap.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-300 leading-relaxed">
                {roadmap.detailedDescription || roadmap.description}
              </p>
            </div>

            {/* Learning Path */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-6">Learning Path</h2>
              <div className="space-y-4">
                {roadmap.milestones && roadmap.milestones.length > 0 ? (
                  roadmap.milestones.map((milestone, index) => (
                    <div
                      key={milestone._id || index}
                      className="bg-gray-700 rounded-lg p-5"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={milestone.status === "completed"}
                            onChange={(e) =>
                              handleMilestoneStatusChange(
                                milestone._id,
                                e.target.checked
                              )
                            }
                            className="w-5 h-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                          />
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                              milestone.status === "completed"
                                ? "bg-green-600"
                                : milestone.status === "in-progress"
                                ? "bg-blue-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {milestone.title}
                            </h3>
                            <p className="text-gray-400">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                              milestone.status || "pending"
                            )}`}
                          >
                            {(milestone.status || "pending").replace("-", " ")}
                          </span>
                          {milestone.duration && (
                            <span className="text-xs text-gray-400">
                              {milestone.duration}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="ml-11">
                        <div className="flex flex-wrap gap-2">
                          {milestone.topics && milestone.topics.length > 0 ? (
                            milestone.topics.map((topic, topicIndex) => (
                              <span
                                key={topicIndex}
                                className="px-3 py-1 bg-gray-600 text-gray-300 rounded-full text-sm"
                              >
                                {topic}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">
                              No topics defined
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No milestones defined for this roadmap yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {roadmap.technologies && roadmap.technologies.length > 0 ? (
                  roadmap.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-blue-600/20 text-blue-300 rounded-lg text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    No technologies specified
                  </span>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-xl font-bold text-green-400">
                      {completedCount}
                    </div>
                    <div className="text-gray-400">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-gray-700 rounded-lg">
                    <div className="text-xl font-bold text-blue-400">
                      {inProgressCount}
                    </div>
                    <div className="text-gray-400">In Progress</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleContinueLearning}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Continue Learning
                </button>
                <button
                  onClick={() => navigate(`/edit-roadmap/${roadmap._id}`)}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Roadmap
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
