# 🔐 Secure File Storage System

A full-stack application built with **Next.js**, **Express.js**, **MongoDB**, **Redux Toolkit**, and **AWS S3** that allows users to securely upload, view, and manage files and folders with authentication.

---

## 🚀 Features

- ✅ User Authentication (JWT-based)
- 📁 Folder Creation, Update, Delete
- 📂 File Upload, View, Delete
- 🔍 File Filtering
- ☁️ AWS S3 Integration
- 🔒 Protected API Routes
- 🐳 Docker & Vercel/Render Deployment Ready

---

## 🛠️ Tech Stack

**Frontend:** Next.js, TailwindCSS, Redux Toolkit  
**Backend:** Express.js, MongoDB, Mongoose  
**Cloud:** AWS S3  
**Other:** Docker, CORS, dotenv, cookie-parser

---

## 📦 Local Development Setup

### 1. Clone the repo

git clone https://github.com/your-username/secure-file-storage-system.git
cd secure-file-storage-system

2. Backend Setup

cd backend
npm install
cp .env.example .env
npm run dev

3. Frontend Setup

cd frontend
npm install
cp .env.example .env
npm run dev

🔑 Sample .env.example
Backend (/backend/.env.example)

PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name
Frontend (/frontend/.env.example)

NEXT_PUBLIC_API_URL=http://localhost:5000/api
📘 API Documentation
All routes are prefixed with /api

🔐 Auth Routes
Method	Endpoint	       Description
POST	  /auth/register	 Register user
POST	  /auth/login	     Login user

📁 Folder Routes (Protected)
Method	Endpoint	          Description
GET	    /folders	          Get all folders
POST	  /folders	          Create new folder
PUT	    /folders/:folderId	Update folder
DELETE	/folders/:folderId	Delete folder

📂 File Routes (Protected)
Method	Endpoint	          Description
GET	     /files	            Get all files (optional ?type=image/pdf/...)
POST	   /files/upload	    Upload multiple files (max 10)
DELETE	 /files/:id	        Delete file by ID

🔒 All file and folder routes require a valid JWT cookie.

📤 Deployment
Frontend: Vercel

Backend: Render

