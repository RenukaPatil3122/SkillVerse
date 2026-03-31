// server/seed.js
// Run once: node seed.js
// This populates your MongoDB with fake users and roadmaps so stats look real.

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ── Models (inline so you don't need to import from your app) ──────────────────

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
  },
  { timestamps: true },
);

const RoadmapSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    createdBy: mongoose.Schema.Types.ObjectId,
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const User = mongoose.model("User", UserSchema);
const Roadmap = mongoose.model("Roadmap", RoadmapSchema);

// ── Fake Data ──────────────────────────────────────────────────────────────────

const fakeUsers = [
  { name: "Aarav Sharma", email: "aarav.sharma@gmail.com" },
  { name: "Priya Nair", email: "priya.nair@gmail.com" },
  { name: "Rohan Mehta", email: "rohan.mehta@outlook.com" },
  { name: "Sneha Kulkarni", email: "sneha.kulkarni@yahoo.com" },
  { name: "Vikram Das", email: "vikram.das@gmail.com" },
  { name: "Ananya Iyer", email: "ananya.iyer@gmail.com" },
  { name: "Karan Joshi", email: "karan.joshi@hotmail.com" },
  { name: "Deepika Reddy", email: "deepika.reddy@gmail.com" },
  { name: "Arjun Patel", email: "arjun.patel@gmail.com" },
  { name: "Meera Bose", email: "meera.bose@gmail.com" },
  { name: "Siddharth Rao", email: "siddharth.rao@gmail.com" },
  { name: "Pooja Desai", email: "pooja.desai@yahoo.com" },
  { name: "Rahul Verma", email: "rahul.verma@gmail.com" },
  { name: "Kavya Singh", email: "kavya.singh@gmail.com" },
  { name: "Nikhil Gupta", email: "nikhil.gupta@gmail.com" },
  { name: "Tanvi Shah", email: "tanvi.shah@outlook.com" },
  { name: "Aditya Kumar", email: "aditya.kumar@gmail.com" },
  { name: "Riya Chatterjee", email: "riya.chatterjee@gmail.com" },
  { name: "Manish Tiwari", email: "manish.tiwari@gmail.com" },
  { name: "Shruti Pillai", email: "shruti.pillai@gmail.com" },
  { name: "Gaurav Malhotra", email: "gaurav.malhotra@gmail.com" },
  { name: "Nisha Kapoor", email: "nisha.kapoor@gmail.com" },
  { name: "Arnav Mishra", email: "arnav.mishra@gmail.com" },
  { name: "Divya Shetty", email: "divya.shetty@gmail.com" },
  { name: "Yash Pandey", email: "yash.pandey@gmail.com" },
  { name: "Swati Jain", email: "swati.jain@gmail.com" },
  { name: "Harsh Agarwal", email: "harsh.agarwal@gmail.com" },
  { name: "Isha Bhatt", email: "isha.bhatt@gmail.com" },
  { name: "Varun Nambiar", email: "varun.nambiar@gmail.com" },
  { name: "Pallavi Menon", email: "pallavi.menon@gmail.com" },
  { name: "Ritesh Saxena", email: "ritesh.saxena@gmail.com" },
  { name: "Kriti Anand", email: "kriti.anand@gmail.com" },
  { name: "Tushar Chandra", email: "tushar.chandra@gmail.com" },
  { name: "Anjali Srivastava", email: "anjali.srivastava@gmail.com" },
  { name: "Mohit Thakur", email: "mohit.thakur@gmail.com" },
  { name: "Sonal Dubey", email: "sonal.dubey@gmail.com" },
  { name: "Dev Kohli", email: "dev.kohli@gmail.com" },
  { name: "Preeti Negi", email: "preeti.negi@gmail.com" },
  { name: "Abhinav Roy", email: "abhinav.roy@gmail.com" },
  { name: "Lakshmi Venkat", email: "lakshmi.venkat@gmail.com" },
  { name: "Samir Sheikh", email: "samir.sheikh@gmail.com" },
  { name: "Ritu Garg", email: "ritu.garg@gmail.com" },
  { name: "Chirag Bhatia", email: "chirag.bhatia@gmail.com" },
  { name: "Namrata Pawar", email: "namrata.pawar@gmail.com" },
  { name: "Vivek Lal", email: "vivek.lal@gmail.com" },
  { name: "Tara Sundaram", email: "tara.sundaram@gmail.com" },
  { name: "Parth Rastogi", email: "parth.rastogi@gmail.com" },
  { name: "Simran Bakshi", email: "simran.bakshi@gmail.com" },
  { name: "Akash Dhar", email: "akash.dhar@gmail.com" },
  { name: "Varsha Pande", email: "varsha.pande@gmail.com" },
  { name: "Kunal Oberoi", email: "kunal.oberoi@gmail.com" },
  { name: "Ishaan Bajaj", email: "ishaan.bajaj@gmail.com" },
  { name: "Manya Sethi", email: "manya.sethi@gmail.com" },
  { name: "Rohit Yadav", email: "rohit.yadav@gmail.com" },
  { name: "Charu Tripathi", email: "charu.tripathi@gmail.com" },
  { name: "Sameer Khanna", email: "sameer.khanna@gmail.com" },
  { name: "Diksha Walia", email: "diksha.walia@gmail.com" },
  { name: "Ashwin Pillai", email: "ashwin.pillai@gmail.com" },
  { name: "Neha Ahuja", email: "neha.ahuja@gmail.com" },
  { name: "Vishal Bansal", email: "vishal.bansal@gmail.com" },
  { name: "Aditi Rana", email: "aditi.rana@gmail.com" },
  { name: "Pankaj Sinha", email: "pankaj.sinha@gmail.com" },
  { name: "Himani Ghosh", email: "himani.ghosh@gmail.com" },
  { name: "Sumit Dutta", email: "sumit.dutta@gmail.com" },
  { name: "Bhavna Rawat", email: "bhavna.rawat@gmail.com" },
  { name: "Kartik Mohan", email: "kartik.mohan@gmail.com" },
  { name: "Sonali Mukherji", email: "sonali.mukherji@gmail.com" },
  { name: "Nitin Verma", email: "nitin.verma22@gmail.com" },
  { name: "Aparna Das", email: "aparna.das@gmail.com" },
  { name: "Saurabh Shukla", email: "saurabh.shukla@gmail.com" },
  { name: "Richa Mittal", email: "richa.mittal@gmail.com" },
  { name: "Pulkit Arora", email: "pulkit.arora@gmail.com" },
  { name: "Garima Tyagi", email: "garima.tyagi@gmail.com" },
  { name: "Neeraj Pal", email: "neeraj.pal@gmail.com" },
  { name: "Megha Biswas", email: "megha.biswas@gmail.com" },
  { name: "Deepak Naik", email: "deepak.naik@gmail.com" },
  { name: "Shweta Lele", email: "shweta.lele@gmail.com" },
  { name: "Ankit Raut", email: "ankit.raut@gmail.com" },
  { name: "Madhuri Sapre", email: "madhuri.sapre@gmail.com" },
  { name: "Suresh Mane", email: "suresh.mane@gmail.com" },
  { name: "Radha Kulkarni", email: "radha.kulkarni@gmail.com" },
  { name: "Tejas More", email: "tejas.more@gmail.com" },
  { name: "Anuradha Patil", email: "anuradha.patil@gmail.com" },
  { name: "Omkar Jadhav", email: "omkar.jadhav@gmail.com" },
  { name: "Vrinda Deshpande", email: "vrinda.deshpande@gmail.com" },
  { name: "Sachin Gaikwad", email: "sachin.gaikwad@gmail.com" },
  { name: "Smita Shinde", email: "smita.shinde@gmail.com" },
  { name: "Ajinkya Bhosale", email: "ajinkya.bhosale@gmail.com" },
  { name: "Rupali Chavan", email: "rupali.chavan@gmail.com" },
  { name: "Aakash Deshmukh", email: "aakash.deshmukh@gmail.com" },
  { name: "Prajakta Kale", email: "prajakta.kale@gmail.com" },
  { name: "Nilesh Pawar", email: "nilesh.pawar@gmail.com" },
  { name: "Ashwini Salunke", email: "ashwini.salunke@gmail.com" },
  { name: "Prasad Naik", email: "prasad.naik@gmail.com" },
  { name: "Snehal Thakare", email: "snehal.thakare@gmail.com" },
  { name: "Amit Wagh", email: "amit.wagh@gmail.com" },
  { name: "Gauri Phadke", email: "gauri.phadke@gmail.com" },
  { name: "Rahul Gokhale", email: "rahul.gokhale@gmail.com" },
  { name: "Pooja Kulkarni", email: "pooja.kulkarni22@gmail.com" },
];

const roadmapData = [
  // Web Dev
  {
    title: "Frontend Developer Roadmap",
    category: "Web Development",
    description: "Complete path from HTML/CSS to React and beyond.",
  },
  {
    title: "Backend Developer Roadmap",
    category: "Web Development",
    description: "Node.js, Express, databases, REST APIs and deployment.",
  },
  {
    title: "Full Stack MERN Developer",
    category: "Web Development",
    description: "MongoDB, Express, React, Node — the complete stack.",
  },
  {
    title: "React.js Mastery Path",
    category: "Web Development",
    description: "Hooks, context, Redux, performance optimization.",
  },
  {
    title: "Vue.js Developer Path",
    category: "Web Development",
    description: "From Vue basics to Vuex and Nuxt.js.",
  },
  {
    title: "Next.js & SSR Roadmap",
    category: "Web Development",
    description: "Server-side rendering, API routes, and deployment.",
  },
  {
    title: "TypeScript for Developers",
    category: "Web Development",
    description: "Strong typing, generics, and advanced TS patterns.",
  },
  {
    title: "Web Performance Optimization",
    category: "Web Development",
    description: "Core Web Vitals, lazy loading, and bundle optimization.",
  },
  {
    title: "HTML & CSS Foundations",
    category: "Web Development",
    description: "Semantic HTML, Flexbox, Grid, and responsive design.",
  },
  {
    title: "REST API Design",
    category: "Web Development",
    description: "Best practices for designing scalable RESTful APIs.",
  },

  // DSA
  {
    title: "Data Structures & Algorithms",
    category: "DSA",
    description: "Arrays, trees, graphs, DP — everything for interviews.",
  },
  {
    title: "LeetCode Patterns Roadmap",
    category: "DSA",
    description: "Sliding window, two pointers, BFS/DFS patterns.",
  },
  {
    title: "Competitive Programming Path",
    category: "DSA",
    description: "From Codeforces div3 to advanced problem solving.",
  },
  {
    title: "System Design for Beginners",
    category: "DSA",
    description: "CAP theorem, load balancing, caching, databases.",
  },
  {
    title: "Dynamic Programming Deep Dive",
    category: "DSA",
    description: "Memoization, tabulation, and all DP patterns.",
  },
  {
    title: "Graph Algorithms Roadmap",
    category: "DSA",
    description: "BFS, DFS, Dijkstra, Bellman-Ford, and more.",
  },

  // AI/ML
  {
    title: "Machine Learning Roadmap",
    category: "AI/ML",
    description: "Supervised, unsupervised, and reinforcement learning.",
  },
  {
    title: "Deep Learning with PyTorch",
    category: "AI/ML",
    description: "CNNs, RNNs, transformers, and model deployment.",
  },
  {
    title: "Natural Language Processing",
    category: "AI/ML",
    description: "Tokenization, embeddings, BERT, and LLMs.",
  },
  {
    title: "Computer Vision Path",
    category: "AI/ML",
    description: "Image classification, object detection, segmentation.",
  },
  {
    title: "AI for Beginners",
    category: "AI/ML",
    description: "Python, numpy, pandas, and sklearn fundamentals.",
  },
  {
    title: "Generative AI & Prompt Engineering",
    category: "AI/ML",
    description: "LLM APIs, RAG, agents, and fine-tuning basics.",
  },
  {
    title: "MLOps Roadmap",
    category: "AI/ML",
    description: "Model versioning, CI/CD for ML, monitoring in production.",
  },

  // DevOps
  {
    title: "DevOps Engineer Roadmap",
    category: "DevOps",
    description: "CI/CD, Docker, Kubernetes, and cloud platforms.",
  },
  {
    title: "Docker & Kubernetes Mastery",
    category: "DevOps",
    description: "Containerization, orchestration, and Helm charts.",
  },
  {
    title: "AWS Cloud Practitioner Path",
    category: "DevOps",
    description: "EC2, S3, Lambda, RDS, and cloud architecture.",
  },
  {
    title: "Linux & Shell Scripting",
    category: "DevOps",
    description: "Bash scripting, cron jobs, and system administration.",
  },
  {
    title: "CI/CD Pipeline Design",
    category: "DevOps",
    description: "GitHub Actions, Jenkins, and deployment automation.",
  },
  {
    title: "Infrastructure as Code",
    category: "DevOps",
    description: "Terraform, Ansible, and cloud provisioning.",
  },
  {
    title: "Site Reliability Engineering",
    category: "DevOps",
    description: "SLIs, SLOs, incident management, and on-call best practices.",
  },

  // Mobile
  {
    title: "Android Developer Roadmap",
    category: "Mobile",
    description: "Java/Kotlin, Jetpack Compose, and Play Store deployment.",
  },
  {
    title: "iOS Development with Swift",
    category: "Mobile",
    description: "UIKit, SwiftUI, Core Data, and App Store publishing.",
  },
  {
    title: "React Native Cross-Platform",
    category: "Mobile",
    description: "Build apps for Android and iOS with one codebase.",
  },
  {
    title: "Flutter Developer Path",
    category: "Mobile",
    description: "Dart, widgets, state management, and deployment.",
  },

  // Database
  {
    title: "SQL & Database Design",
    category: "Database",
    description: "Normalization, joins, indexes, and query optimization.",
  },
  {
    title: "MongoDB & NoSQL Roadmap",
    category: "Database",
    description: "Schema design, aggregation pipelines, and Atlas.",
  },
  {
    title: "PostgreSQL Advanced Guide",
    category: "Database",
    description: "Window functions, CTEs, triggers, and performance.",
  },
  {
    title: "Redis & Caching Strategies",
    category: "Database",
    description: "Data structures, pub/sub, and caching patterns.",
  },
  {
    title: "Database Administration Path",
    category: "Database",
    description: "Backup, replication, scaling, and monitoring.",
  },

  // Security
  {
    title: "Cybersecurity Fundamentals",
    category: "Security",
    description: "CIA triad, threat modeling, and ethical hacking basics.",
  },
  {
    title: "Web Application Security",
    category: "Security",
    description: "OWASP Top 10, XSS, CSRF, SQLi, and secure coding.",
  },
  {
    title: "Ethical Hacking Roadmap",
    category: "Security",
    description: "Reconnaissance, exploitation, and penetration testing.",
  },
  {
    title: "Cryptography for Developers",
    category: "Security",
    description: "Hashing, encryption, TLS, and JWT security.",
  },

  // Career
  {
    title: "Tech Interview Preparation",
    category: "Career",
    description: "Resume, DSA, system design, and behavioral rounds.",
  },
  {
    title: "Open Source Contribution Guide",
    category: "Career",
    description: "How to find issues, make PRs, and build a portfolio.",
  },
  {
    title: "Freelancing as a Developer",
    category: "Career",
    description:
      "Finding clients, pricing, contracts, and delivering projects.",
  },
  {
    title: "Building Your Dev Portfolio",
    category: "Career",
    description: "Projects, GitHub profile, and personal branding.",
  },
  {
    title: "Tech Lead & Engineering Manager Path",
    category: "Career",
    description: "Leadership, architecture decisions, and team management.",
  },

  // Misc
  {
    title: "Git & GitHub Mastery",
    category: "Tools",
    description: "Branching strategies, rebasing, and open source workflows.",
  },
  {
    title: "GraphQL API Development",
    category: "Web Development",
    description: "Schema, resolvers, subscriptions, and Apollo.",
  },
  {
    title: "WebSockets & Real-Time Apps",
    category: "Web Development",
    description: "Socket.io, real-time chat, and live dashboards.",
  },
  {
    title: "Blockchain & Web3 Basics",
    category: "Emerging Tech",
    description: "Smart contracts, Ethereum, and dApp fundamentals.",
  },
  {
    title: "Microservices Architecture",
    category: "DevOps",
    description: "Service mesh, event-driven design, and API gateways.",
  },
  {
    title: "Rust for Systems Programming",
    category: "Languages",
    description: "Ownership, lifetimes, async, and systems-level projects.",
  },
  {
    title: "Go Language Roadmap",
    category: "Languages",
    description: "Goroutines, channels, and building CLI tools.",
  },
  {
    title: "Python for Automation",
    category: "Languages",
    description: "Scripting, web scraping, task automation, and APIs.",
  },
];

// ── Seed Function ──────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Hash a common password for all fake users
    const hashedPassword = await bcrypt.hash("FakePass@123", 10);

    let usersCreated = 0;
    let usersSkipped = 0;

    for (const u of fakeUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create({ ...u, password: hashedPassword });
        usersCreated++;
      } else {
        usersSkipped++;
      }
    }

    console.log(
      `👤 Users: ${usersCreated} created, ${usersSkipped} already existed`,
    );

    // Get all user IDs to assign as creators
    const allUsers = await User.find({}, "_id");
    const userIds = allUsers.map((u) => u._id);

    let roadmapsCreated = 0;
    let roadmapsSkipped = 0;

    for (let i = 0; i < roadmapData.length; i++) {
      const r = roadmapData[i];
      const exists = await Roadmap.findOne({ title: r.title });
      if (!exists) {
        const randomCreator = userIds[i % userIds.length];
        await Roadmap.create({
          ...r,
          createdBy: randomCreator,
          isPublic: true,
        });
        roadmapsCreated++;
      } else {
        roadmapsSkipped++;
      }
    }

    console.log(
      `🗺️  Roadmaps: ${roadmapsCreated} created, ${roadmapsSkipped} already existed`,
    );
    console.log("\n🎉 Seed complete!");
    console.log(`   Total users in DB: ${await User.countDocuments()}`);
    console.log(`   Total roadmaps in DB: ${await Roadmap.countDocuments()}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
