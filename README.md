

# 🚀 LearnCode - Coding Platform

**LearnCode** is a coding assessment platform built with the **MERN stack**, designed to simulate real-world coding evaluations. It features AI-powered dynamic question generation, real-time collaboration, multi-language support, and role-based access to create an intelligent, efficient, and secure learning environment.

🌐 **Live Demo**:
[https://learn-code-three.vercel.app/](https://learn-code-three.vercel.app/)


## 🔧 Tech Stack

* **Frontend**: React.js, Tailwind CSS, Hero UI
* **Backend**: Node.js, Express.js, MongoDB
* **Authentication**: JWT, Cookie-based Sessions
* **AI Integration**: Gemini API (dynamic question generation)
* **Compiler API**: Judge0 (multi-language support)
* **Email Services**: Gmail SMTP
* **Real-time Communication**: Socket.io

## ✨ Features

### 👥 Role-Based Access

* **Admin Dashboard**

  * Create, update, delete, and restore coding tests
  * Manage users and monitor test scores

* **User Panel**

  * Secure registration and email verification
  * Take real-time coding assessments
  * View test results and receive notifications

### 🔐 Authentication & Security

* Secure login with JWT-based token handling
* Refresh tokens with cookie-based sessions
* Strict access control based on roles

### ⚙️ Intelligent & Interactive

* AI-generated questions using Gemini API
* Real-time test status updates with Socket.io
* Clean and responsive UI/UX across devices

## 🚀 Getting Started

### Prerequisites

* Node.js & npm
* MongoDB
* Gmail account (for SMTP service)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Nidhibhide/LearnCode.git
   cd learncode
   ```

2. **Run Backend**:

   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Run Frontend**:

   ```bash
   cd client
   npm install
   npm run dev
   ```

