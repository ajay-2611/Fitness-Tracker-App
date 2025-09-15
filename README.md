# Fitness Tracker App
I9RFQ5lzp9DQZPv6yoBc7
A full-stack fitness tracking application built with MERN stack (MongoDB, Express.js, React.js, Node.js).

## 🚀 Features

- User authentication (Register/Login)
- Track fitness activities and workouts
- View workout history and progress
- Responsive design for all devices
- Secure API with JWT authentication

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS Modules

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (for production) or MongoDB Community Server (for local development)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Fitness-Tracker-App.git
cd Fitness-Tracker-App
```

### 2. Set up the Backend

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create a .env file in the server directory and add:
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Start the development server
npm run dev
```

### 3. Set up the Frontend

```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start the development server
npm start
```

## 🌐 Environment Variables

### Server (`.env` file in server directory)

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
PORT=8000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 📂 Project Structure

```
fitness-tracker-app/
├── client/               # Frontend React application
│   ├── public/          # Static files
│   └── src/             # React components and pages
├── server/              # Backend Node.js application
│   ├── middleware/      # Authentication middleware
│   ├── models/          # MongoDB models
│   ├── routes/         # API routes
│   ├── .env           # Environment variables (gitignored)
│   └── server.js      # Main server file
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🔒 Security

- JWT authentication
- Password hashing with bcrypt
- Environment variables for sensitive data
- Helmet.js for securing HTTP headers

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the database hosting
- [React](https://reactjs.org/) for the frontend library
- [Express](https://expressjs.com/) for the backend framework
