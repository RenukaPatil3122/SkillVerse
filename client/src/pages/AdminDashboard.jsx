

import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STORAGE_KEY = "sv_admin_token";

// ── Mini bar chart (pure CSS, no library needed) ─────────────────────────────
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-2 h-32 mt-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-purple-600 to-blue-400 transition-all duration-700"
            style={{
              height: `${(d.count / max) * 100}%`,
              minHeight: d.count > 0 ? "8px" : "2px",
              opacity: d.count > 0 ? 1 : 0.2,
            }}
            title={`${d.count} signups`}
          />
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {d.date}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div
      className={`rounded-2xl p-5 border ${color} bg-gray-900/60 backdrop-blur`}
    >
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-4xl font-extrabold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

// ── Login screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem(STORAGE_KEY, data.token);
        onLogin(data.token);
      } else {
        setError("Wrong password. Try again.");
      }
    } catch {
      setError("Can't reach server. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-2 mb-8">
          <span className="bg-purple-600 text-white rounded px-2 py-0.5 font-mono text-sm">
            &lt;/&gt;
          </span>
          <span className="text-white font-bold text-lg">Skillverse Admin</span>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Enter admin password to continue
        </p>
        <input
          type="password"
          placeholder="Password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 mb-3 outline-none focus:border-purple-500 transition-colors"
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? "Checking..." : "Login →"}
        </button>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) || "",
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [deleting, setDeleting] = useState(null);

  const fetchData = async (t) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/stats`, {
        headers: { "x-admin-token": t },
      });
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        setError("Failed to load data.");
        setToken("");
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      setError("Can't reach server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData(token);
  }, [token]);

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`${BACKEND_URL}/api/admin/${type}/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token },
      });
      fetchData(token); // refresh
    } catch {
      alert("Delete failed.");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
    setData(null);
  };

  if (!token) return <LoginScreen onLogin={setToken} />;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-purple-600 text-white rounded px-2 py-0.5 font-mono text-sm">
            &lt;/&gt;
          </span>
          <span className="font-bold text-lg">Skillverse</span>
          <span className="text-gray-500 text-sm">/ Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => fetchData(token)}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading && !data && (
          <div className="flex items-center justify-center py-32">
            <div className="text-gray-400 animate-pulse">
              Loading dashboard...
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-4 text-red-300 mb-6">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                label="Total Users"
                value={data.totals.users}
                sub={`+${data.growth.newUsersWeek} this week`}
                color="border-blue-800"
              />
              <StatCard
                label="Total Roadmaps"
                value={data.totals.roadmaps}
                sub={`+${data.growth.newRoadmapsWeek} this week`}
                color="border-purple-800"
              />
              <StatCard
                label="New This Month"
                value={data.growth.newUsersMonth}
                sub="user signups"
                color="border-green-800"
              />
              <StatCard
                label="Community Posts"
                value={data.totals.posts}
                sub="total posts"
                color="border-yellow-800"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-800 pb-2">
              {["overview", "users", "roadmaps"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview tab */}
            {activeTab === "overview" && (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Growth chart */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="font-semibold mb-1">
                    User Signups — Last 7 Days
                  </h3>
                  <p className="text-gray-500 text-xs mb-4">
                    Daily new registrations
                  </p>
                  <BarChart data={data.userGrowth} />
                </div>

                {/* Roadmaps by category */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                  <h3 className="font-semibold mb-4">Roadmaps by Category</h3>
                  <div className="space-y-3">
                    {data.roadmapsByCategory.map((cat) => {
                      const pct = Math.round(
                        (cat.count / data.totals.roadmaps) * 100,
                      );
                      return (
                        <div key={cat._id}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-300">
                              {cat._id || "Uncategorized"}
                            </span>
                            <span className="text-gray-500">{cat.count}</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Users tab */}
            {activeTab === "users" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="font-semibold">Recent Users</h3>
                  <span className="text-gray-500 text-sm">Showing last 10</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                      <th className="text-left px-6 py-3">Name</th>
                      <th className="text-left px-6 py-3">Email</th>
                      <th className="text-left px-6 py-3">Joined</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentUsers.map((u) => (
                      <tr
                        key={u._id}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {u.name || "—"}
                        </td>
                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete("users", u._id)}
                            disabled={deleting === u._id}
                            className="text-red-500 hover:text-red-400 text-xs disabled:opacity-50 transition-colors"
                          >
                            {deleting === u._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Roadmaps tab */}
            {activeTab === "roadmaps" && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                  <h3 className="font-semibold">Recent Roadmaps</h3>
                  <span className="text-gray-500 text-sm">Showing last 10</span>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase">
                      <th className="text-left px-6 py-3">Title</th>
                      <th className="text-left px-6 py-3">Category</th>
                      <th className="text-left px-6 py-3">Created</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentRoadmaps.map((r) => (
                      <tr
                        key={r._id}
                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">{r.title}</td>
                        <td className="px-6 py-4">
                          <span className="bg-purple-900/50 text-purple-300 text-xs px-2 py-1 rounded-full">
                            {r.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(r.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${r.isPublic ? "bg-green-900/50 text-green-300" : "bg-gray-800 text-gray-400"}`}
                          >
                            {r.isPublic ? "Public" : "Private"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete("roadmaps", r._id)}
                            disabled={deleting === r._id}
                            className="text-red-500 hover:text-red-400 text-xs disabled:opacity-50 transition-colors"
                          >
                            {deleting === r._id ? "Deleting..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
