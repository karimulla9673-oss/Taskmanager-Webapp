# 🚀 MERN Stack Task Manager with Authentication

A full-stack web application built with MongoDB, Express.js, React.js, and Node.js (MERN) featuring JWT authentication, user management, and CRUD operations for tasks.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Security Features](#security-features)
- [Scalability](#scalability)

## ✨ Features

### Authentication
- ✅ User registration with validation
- ✅ Secure login with JWT tokens
- ✅ Password hashing using bcrypt
- ✅ Protected routes (frontend & backend)
- ✅ Token-based authentication
- ✅ Logout functionality

### Task Management
- ✅ Create, Read, Update, Delete (CRUD) tasks
- ✅ Task status: Pending, In Progress, Completed
- ✅ Priority levels: Low, Medium, High
- ✅ Due date tracking
- ✅ Search and filter tasks
- ✅ Real-time task statistics

### User Interface
- ✅ Responsive design with TailwindCSS
- ✅ Clean and modern UI
- ✅ Form validation (client & server)
- ✅ Error handling and user feedback
- ✅ Loading states

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Vite** - Build tool

## 📁 Project Structure

```
mern-auth-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication routes
│   │   └── taskRoutes.js         # Task CRUD routes
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation component
│   │   │   ├── TaskForm.jsx      # Task creation/edit form
│   │   │   └── TaskList.jsx      # Task list with filters
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Login page
│   │   │   ├── Register.jsx      # Registration page
│   │   │   └── Dashboard.jsx     # Main dashboard
│   │   ├── utils/
│   │   │   └── api.js            # API calls & auth helpers
│   │   ├── App.jsx               # Main app component
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

### Step 1: Clone or Create Project Structure

Create the following folder structure:

```bash
mkdir mern-auth-app
cd mern-auth-app
mkdir backend frontend
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Initialize npm
npm init -y

# Install dependencies
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator

# Install dev dependencies
npm install --save-dev nodemon
```

Create all backend files as provided above (server.js, models, routes, etc.)

### Step 3: Backend Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-auth-app
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_abc123xyz789
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** 
- If using MongoDB Atlas, replace `MONGODB_URI` with your connection string
- Change `JWT_SECRET` to a secure random string in production

### Step 4: Frontend Setup

```bash
# Navigate to frontend folder (from project root)
cd ../frontend

# Create Vite + React app
npm create vite@latest . -- --template react

# Install dependencies
npm install

# Install additional packages
npm install react-router-dom axios

# Install TailwindCSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Create all frontend files as provided above (components, pages, utils, etc.)

### Step 5: Configure TailwindCSS

Update `tailwind.config.js`:

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 🏃‍♂️ Running the Application

### Start MongoDB

If using local MongoDB:

```bash
# On Windows (if MongoDB installed as service)
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

### Start Backend Server

```bash
# From backend folder
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 5000
✅ MongoDB Connected: localhost
📊 Database Name: mern-auth-app
```

### Start Frontend Development Server

Open a new terminal:

```bash
# From frontend folder
cd frontend
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <your-jwt-token>
```

### Task Endpoints (All Protected)

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <your-jwt-token>
```

Query parameters:
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `sort` - Sort by (oldest, title, dueDate)

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Build MERN app",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <your-jwt-token>
```

#### Search Tasks
```http
GET /api/tasks/search?q=project
Authorization: Bearer <your-jwt-token>
```

## 🔐 Security Features

1. **Password Security**
   - Passwords are hashed using bcrypt with salt rounds
   - Never stored in plain text

2. **JWT Authentication**
   - Tokens expire after 30 days
   - Tokens are validated on every protected request
   - Invalid tokens result in 401 Unauthorized

3. **Input Validation**
   - Server-side validation using express-validator
   - Client-side validation in forms
   - SQL injection prevention through Mongoose

4. **CORS Configuration**
   - Whitelisted frontend origin
   - Prevents unauthorized API access

5. **Error Handling**
   - Centralized error handling
   - No sensitive information in error messages

## 📈 Scalability

### Architecture Decisions

1. **Modular Structure**
   - Separated concerns (routes, controllers, models)
   - Easy to add new features
   - Maintainable codebase

2. **RESTful API Design**
   - Stateless architecture
   - Horizontal scaling ready
   - Standard HTTP methods

3. **Database Indexing**
   - Indexed email field for fast user lookups
   - Indexed user-task relationships
   - Text search index for task searching

4. **Environment Configuration**
   - Separate configs for dev/prod
   - Easy deployment to cloud platforms

### Scaling Strategies

1. **Horizontal Scaling**
   - Add more server instances
   - Use load balancer (Nginx, AWS ELB)
   - JWT enables stateless authentication

2. **Database Scaling**
   - MongoDB sharding for large datasets
   - Read replicas for read-heavy workloads
   - Caching layer (Redis) for frequent queries

3. **Performance Optimization**
   - Implement pagination for large result sets
   - Add caching for static content
   - Optimize database queries
   - Implement rate limiting

4. **Monitoring & Logging**
   - Add application monitoring (New Relic, DataDog)
   - Centralized logging (ELK Stack)
   - Error tracking (Sentry)

## 🚢 Deployment

### Backend Deployment (e.g., Render, Railway, Heroku)

1. Push code to GitHub
2. Create new web service
3. Set environment variables
4. Deploy from GitHub repo

### Frontend Deployment (e.g., Vercel, Netlify)

1. Push code to GitHub
2. Import project
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variable: `VITE_API_URL=<your-backend-url>`

## 🧪 Testing the Application

### Manual Testing Steps

1. **Registration**
   - Go to register page
   - Create account with valid credentials
   - Should redirect to dashboard

2. **Login**
   - Logout and go to login page
   - Login with created credentials
   - Should see dashboard with tasks

3. **Create Task**
   - Fill in task form
   - Click "Create Task"
   - Task should appear in list

4. **Edit Task**
   - Click "Edit" on a task
   - Modify details
   - Click "Update Task"

5. **Delete Task**
   - Click "Delete" on a task
   - Confirm deletion
   - Task should be removed

6. **Filter Tasks**
   - Use status and priority filters
   - Search tasks by title/description

### Using Postman

Import the provided Postman collection or manually test each endpoint as documented above.

## 📝 Common Issues & Solutions

### Backend Issues

**MongoDB Connection Failed**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**Port Already in Use**
- Change PORT in `.env` file
- Kill process using the port: `npx kill-port 5000`

### Frontend Issues

**API Calls Failing**
- Ensure backend is running
- Check API URL in `vite.config.js` or `.env`
- Verify CORS settings in backend

**TailwindCSS Not Working**
- Ensure TailwindCSS is properly configured
- Check if `@tailwind` directives are in `index.css`
- Restart dev server

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 👨‍💻 Author

Created as a learning project for MERN stack development.

## 🙏 Acknowledgments

- MongoDB documentation
- Express.js documentation
- React.js documentation
- TailwindCSS documentation

---

**Happy Coding! 🎉**