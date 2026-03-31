// client/src/pages/Home.jsx
// Stats fetched from real MongoDB via /api/stats
// No navbar here — your existing global Navbar handles it

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, Github, Infinity } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!target) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}+</span>;
}

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: null, roadmaps: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/stats`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.stats);
      })
      .catch((err) => console.error("Stats fetch failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      icon: <BookOpen size={36} strokeWidth={1.5} />,
      value: stats.roadmaps,
      label: "Expert Roadmaps",
      iconColor: "#f59e0b",
    },
    {
      icon: <Users size={36} strokeWidth={1.5} />,
      value: stats.users,
      label: "Active Learners",
      iconColor: "#34d399",
    },
    {
      icon: <Github size={36} strokeWidth={1.5} />,
      value: "Open",
      label: "Source on GitHub",
      iconColor: "#60a5fa",
      isText: true,
    },
    {
      icon: <Infinity size={36} strokeWidth={1.5} />,
      value: "Free",
      label: "Forever to Use",
      iconColor: "#a78bfa",
      isText: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
      <div className="flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <h1 className="text-6xl font-extrabold mb-4">
          <span className="text-yellow-400">Master Your</span>{" "}
          <span className="text-pink-400">Tech Journey</span>
        </h1>
        <p className="text-white/80 text-xl max-w-2xl mb-16 leading-relaxed">
          Transform your career with interactive roadmaps, hands-on projects,
          and expert guidance. From beginner to pro, we've got your learning
          path covered.
        </p>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-16">
          {statCards.map((card, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-white/15 transition-all duration-300"
            >
              <span style={{ color: card.iconColor }}>{card.icon}</span>
              <div className="text-3xl font-bold text-white">
                {card.isText ? (
                  card.value
                ) : loading || card.value === null ? (
                  <span className="text-white/40 text-lg">...</span>
                ) : (
                  <AnimatedCounter target={card.value} />
                )}
              </div>
              <p className="text-white/70 text-sm font-medium">{card.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => navigate("/roadmaps")}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-full flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          Start Learning Now ▶
        </button>
      </div>
    </div>
  );
}
