# SkillVerse

A comprehensive learning platform that helps users discover, track, and master new skills through personalized roadmaps and community collaboration.

## 🚀 Features

- **Personalized Learning Roadmaps**: AI-powered skill development paths
- **Community Collaboration**: Share knowledge and learn together
- **Progress Tracking**: Monitor your learning journey
- **Resource Management**: Curated learning materials
- **User Authentication**: Secure user accounts and profiles

## 🛠 Tech Stack

### Frontend (Client)

- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Router** - Navigation

### Backend (Server)

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB Atlas** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
SkillVerse/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── routes/
│   ├── models/
│   ├── config/
│   ├── middleware/
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/SkillVerse.git
   cd SkillVerse
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the `server` directory:

   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   FRONTEND_URL=http://localhost:3000
   PORT=5000
   NODE_ENV=development
   ```

5. **Run the application**

   Start the backend server:

   ```bash
   cd server
   npm start
   ```

   Start the frontend (in a new terminal):

   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: `http://localhost:3000` or `http://localhost:5173`
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

## 🌐 Deployment

### Backend (Render)

- Deployed on Render
- Environment variables configured
- MongoDB Atlas connection

### Frontend (Vercel)

- Deployed on Vercel
- Automatic deployments from GitHub
- Environment variables for API endpoints

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Roadmaps

- `GET /api/roadmaps` - Get all roadmaps
- `POST /api/roadmaps` - Create new roadmap
- `GET /api/roadmaps/:id` - Get specific roadmap
- `PUT /api/roadmaps/:id` - Update roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap

### Community

- `GET /api/community` - Get community posts
- `POST /api/community` - Create new post

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/YOUR_USERNAME)

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspiration from various learning platforms
- MongoDB Atlas for database hosting
- Vercel and Render for deployment platforms
