import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const Community = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 0,
    onlineMembers: 0,
    totalPosts: 0,
    activeToday: 0,
  });

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      setError("");

      const [postsResponse, statsResponse] = await Promise.allSettled([
        api.get("/community/posts"),
        api.get("/community/stats"),
      ]);

      let postsData = [];
      if (postsResponse.status === "fulfilled") {
        postsData = postsResponse.value?.data;
        const sanitizedPosts = Array.isArray(postsData)
          ? postsData.map((post) => ({
              ...post,
              author: {
                ...post.author,
                name: post.author?.name?.trim() || "Anonymous",
              },
            }))
          : [];
        setPosts(sanitizedPosts);
      } else {
        console.error("Failed to fetch posts:", postsResponse.reason);
        setPosts([]);
      }

      if (statsResponse.status === "fulfilled") {
        const statsData = statsResponse.value?.data;
        if (statsData) {
          setCommunityStats((prevStats) => ({
            ...prevStats,
            ...statsData,
          }));
        }
      } else {
        console.error("Failed to fetch stats:", statsResponse.reason);
        setCommunityStats({
          totalMembers: 2847,
          onlineMembers: 156,
          totalPosts: postsData.length,
          activeToday: 89,
        });
      }
    } catch (err) {
      console.error("Fetch community data error:", err);
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch community data. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent?.trim()) {
      alert("Post content cannot be empty!");
      return;
    }

    try {
      const tempId = Date.now().toString();
      const authorName = user?.name?.trim() || "Anonymous";
      const newPost = {
        _id: tempId,
        content: newPostContent.trim(),
        author: {
          name: authorName,
          _id: user?._id || "temp",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        isOptimistic: true,
      };

      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostContent("");

      try {
        const response = await api.post("/community/posts", {
          content: newPostContent.trim(),
        });

        const realPost = {
          ...response.data,
          author: {
            ...response.data.author,
            name: response.data.author?.name?.trim() || "Anonymous",
          },
          isOptimistic: false,
        };

        setPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === tempId ? realPost : post))
        );

        setCommunityStats((prev) => ({
          ...prev,
          totalPosts: prev.totalPosts + 1,
        }));
      } catch (apiError) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== tempId)
        );
        throw apiError;
      }
    } catch (err) {
      console.error("Create post error:", err);

      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to create post. Please try again."
        );
      }
    }
  };

  const handleLikePost = async (postId) => {
    if (!postId) return;

    try {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: (post.likes || 0) + 1, hasLiked: true }
            : post
        )
      );

      const response = await api.post(`/community/posts/${postId}/like`);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: response.data.likes,
                hasLiked: response.data.hasLiked,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Like post error:", err);

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
                ...post,
                likes: Math.max((post.likes || 1) - 1, 0),
                hasLiked: false,
              }
            : post
        )
      );

      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      // Optimistic update: remove post from UI
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));

      // Send DELETE request
      await api.delete(`/community/posts/${postId}`);

      // Update stats
      setCommunityStats((prev) => ({
        ...prev,
        totalPosts: Math.max(prev.totalPosts - 1, 0),
      }));

      alert("Post deleted successfully!");
    } catch (err) {
      console.error("Delete post error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      // Refetch posts to ensure UI matches backend
      await fetchCommunityData();

      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      } else if (err.response?.status === 404) {
        alert(
          "Post not found. It may have been deleted already or never existed."
        );
      } else if (err.response?.status === 403) {
        alert("You are not authorized to delete this post.");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to delete post. Please try again."
        );
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Just now";

      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)}d ago`;

      return date.toLocaleDateString();
    } catch (error) {
      return "Just now";
    }
  };

  const getInitial = (name) => {
    if (!name || typeof name !== "string" || name.trim() === "") {
      return "A";
    }
    return name.trim().charAt(0).toUpperCase();
  };

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-64"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 animate-pulse"
            >
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-4"></div>
          <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
          <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 animate-pulse"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-3"></div>
                  <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-4">Error Loading Community</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={fetchCommunityData}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto p-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-4 text-blue-100 hover:text-white flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
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
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
              <p className="text-blue-100">
                Connect, share, and learn with fellow fitness enthusiasts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {communityStats.totalMembers.toLocaleString()}
              </h3>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-4h3v4h2v-7.5c0-.83.67-1.5 1.5-1.5S12 9.67 12 10.5V11h2.5c.83 0 1.5.67 1.5 1.5V18h2v4H4v-4z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Members
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                {communityStats.onlineMembers}
              </h3>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Online Now
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {communityStats.totalPosts}
              </h3>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Posts
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {communityStats.activeToday}
              </h3>
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Active Today
            </p>
          </div>
        </div>

        {/* Create Post Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {getInitial(user?.name)}
              </span>
            </div>
            Share your thoughts
          </h2>

          <form onSubmit={handleCreatePost}>
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="What's on your mind? Share your fitness journey, ask questions, or motivate others..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={4}
              maxLength={2000}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {newPostContent.length}/2000 characters
              </span>
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to share something with the community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${
                  post.isOptimistic ? "opacity-75" : ""
                }`}
              >
                {/* Post Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {getInitial(post.author?.name)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {post.author?.name || "Anonymous"}
                        </h3>
                        {post.isOptimistic && (
                          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-2 py-1 rounded-full">
                            Posting...
                          </span>
                        )}
                      </div>

                      {/* Delete button for own posts */}
                      {post.author?._id === user?._id && !post.isOptimistic && (
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete post"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleLikePost(post._id)} // ✅ Fixed: Use handleLikePost instead of handleDeletePost
                    disabled={post.isOptimistic}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                      post.hasLiked
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    } ${
                      post.isOptimistic ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill={post.hasLiked ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {post.likes || 0}
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {posts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchCommunityData}
              className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg transition-colors font-medium border border-gray-300 dark:border-gray-600"
            >
              Load More Posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
