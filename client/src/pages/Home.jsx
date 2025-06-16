import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Zap,
  TrendingUp,
  Award,
  Sparkles,
  Play,
  Code,
  Globe,
} from "lucide-react";

const Home = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Demo data for showcase
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setRoadmaps([
        {
          _id: 1,
          title: "Frontend Development",
          description:
            "Master modern web development with React, Vue, and Angular",
          enrolledCount: "12.5k",
        },
        {
          _id: 2,
          title: "Backend Engineering",
          description:
            "Build scalable server-side applications with Node.js and Python",
          enrolledCount: "8.3k",
        },
        {
          _id: 3,
          title: "Data Science",
          description:
            "Learn data analysis, machine learning, and AI fundamentals",
          enrolledCount: "15.2k",
        },
        {
          _id: 4,
          title: "DevOps",
          description: "Master deployment, CI/CD, and cloud infrastructure",
          enrolledCount: "6.8k",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const RoadmapCard = ({ roadmap }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-2xl">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div className="flex items-center space-x-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              4.8
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
          {roadmap.title || "Sample Roadmap"}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {roadmap.description ||
            "Master the fundamentals and advanced concepts with this comprehensive learning path."}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{roadmap.enrolledCount || "1.2k"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-4 w-4" />
              <span>Beginner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
      <div
        className={`bg-gradient-to-r ${color} p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-400/10 rounded-full blur-xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-400/10 rounded-full blur-xl animate-pulse delay-500" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Main heading with enhanced animation */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-yellow-400 mr-3 animate-spin" />
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  #1 Platform for Tech Skills
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Master Your
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  Tech Journey
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                Transform your career with interactive roadmaps, hands-on
                projects, and expert guidance. From beginner to pro, we've got
                your learning path covered.
              </p>
            </div>

            {/* Enhanced stats with animations */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto animate-slide-up delay-200">
              {[
                {
                  icon: BookOpen,
                  number: "150+",
                  label: "Expert Roadmaps",
                  color: "text-yellow-400",
                },
                {
                  icon: Users,
                  number: "50K+",
                  label: "Active Learners",
                  color: "text-green-400",
                },
                {
                  icon: Award,
                  number: "98%",
                  label: "Success Rate",
                  color: "text-blue-400",
                },
                {
                  icon: Zap,
                  number: "24/7",
                  label: "Support",
                  color: "text-purple-400",
                },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-center mb-4">
                      <stat.icon
                        className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`}
                      />
                    </div>
                    <div className="text-3xl font-black text-white mb-2">
                      {stat.number}
                    </div>
                    <div className="text-blue-200 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center mt-12 animate-slide-up delay-300">
              <button
                onClick={() => window.open("/roadmaps", "_blank")}
                className="group bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-2 cursor-pointer"
              >
                <span>Start Learning Now</span>
                <Play className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
            Why Choose
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Skillverse
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We've reimagined online learning with cutting-edge technology and
            expert-crafted content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={Code}
            title="Structured Learning Paths"
            description="Follow carefully crafted roadmaps designed by industry experts. Each step builds upon the previous one for optimal learning progression."
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={Zap}
            title="Interactive Projects"
            description="Build real-world projects while learning. Every roadmap includes hands-on exercises and portfolio pieces."
            color="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={Globe}
            title="Community Driven"
            description="Join a vibrant community of learners and mentors. Share progress, get help, and collaborate on projects together."
            color="from-yellow-500 to-orange-500"
          />
        </div>
      </div>

      {/* Roadmaps Section */}
      <div className="bg-white dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Popular Learning
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                {" "}
                Roadmaps
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of learners who've transformed their careers with
              our expert-crafted paths
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-3xl h-80" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {roadmaps.length > 0
                ? roadmaps.map((roadmap) => (
                    <RoadmapCard key={roadmap._id} roadmap={roadmap} />
                  ))
                : // Demo cards if no roadmaps
                  [...Array(4)].map((_, i) => (
                    <RoadmapCard
                      key={i}
                      roadmap={{
                        _id: i,
                        title: [
                          "Frontend Development",
                          "Backend Engineering",
                          "Data Science",
                          "DevOps",
                        ][i],
                        description:
                          "Master the fundamentals and advanced concepts with this comprehensive learning path.",
                        enrolledCount: ["12.5k", "8.3k", "15.2k", "6.8k"][i],
                      }}
                    />
                  ))}
            </div>
          )}

          <div className="text-center mt-16">
            <button
              onClick={() => window.open("/roadmaps", "_blank")}
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl cursor-pointer"
            >
              <span className="text-lg">Explore All Roadmaps</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              {" "}
              Career
            </span>
            ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join over 50,000 developers who've accelerated their careers with
            Skillverse
          </p>
          <button
            onClick={() => window.open("/register", "_blank")}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-10 py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl cursor-pointer"
          >
            <span className="text-lg">Get Started Free</span>
            <Sparkles className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
