

#  LearnCode - Coding Platform

**LearnCode** is a coding assessment platform built with the **MERN stack**, designed to simulate real-world coding evaluations. It features AI-powered dynamic question generation, real-time collaboration, multi-language support, and role-based access — all designed to create an intelligent, efficient, and secure learning environment.

 **Live Demo**:
[https://learn-code-three.vercel.app/](https://learn-code-three.vercel.app/)

##  Tech Stack

* **Frontend**: React.js, Tailwind CSS, Hero UI
* **Backend**: Node.js, Express.js, MongoDB
* **Authentication**: JWT, Cookie-based Sessions
* **AI Integration**: Gemini API 
* **Compiler API**: Judge0 
* **Email Services**: Gmail SMTP
* **Real-time Communication**: Socket.io

##  Features

###  Role-Based Access Control

**Admin Dashboard**

* Create, update, delete, and restore coding tests
* Manage users and monitor test performance

**User Panel**

* Secure registration with email verification
* Attempt real-time coding assessments
* View results and receive system notifications

###  Authentication & Security

* Secure login with JWT and refresh tokens
* Cookie-based session management
* Role-based route protection and data access control

###  Intelligent & Interactive

* AI-generated coding questions using Gemini API
* Real-time test updates powered by Socket.io
* Fully responsive, user-friendly UI/UX

##  Getting Started

###  Prerequisites

* Node.js & npm
* MongoDB (local or cloud instance)
* Gmail account for SMTP email service
* **Docker Desktop** (if using Dockerized setup)
  

##  Environment Variables

You can find sample environment configuration files in both the frontend/ and backend/ directories as .env.example.
Duplicate each .env.example file, rename it to .env, and add your credentials.

##  Local Development Setup

###  Clone the Repository

```bash
git clone https://github.com/Nidhibhide/LearnCode.git
cd LearnCode
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

##  Dockerized Setup (Optional)

> Make sure Docker Desktop is installed and running.

### Run the app using Docker:

```bash
docker-compose up --build
```



