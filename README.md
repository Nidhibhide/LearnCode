# LearnCode – Coding Assessment Platform

**LearnCode** is a MERN stack platform for creating and conducting coding assessments. It allows admins to manage tests and users, while students can solve coding questions and view their results.

**Live Demo:** [https://learn-code-three.vercel.app/](https://learn-code-three.vercel.app/)

## Tech Stack

- **Frontend:** React.js, Tailwind CSS, Hero UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT, refresh tokens, HTTP-only cookie-based sessions
- **AI:** Gemini API
- **Code Execution:** Judge0
- **Real-time Updates:** Socket.io
- **Email:** Gmail SMTP

## Features

### Test & Question Management
- Create, update, delete, and restore coding tests.
- Generate coding questions using Gemini AI.
- Import questions in bulk using CSV files.

### Coding Assessments
- Solve coding questions in an online code editor.
- Run code with custom input.
- Execute multiple test cases.
- Compile and evaluate code using Judge0.

### User & Access Management
- Role-based access for administrators and students.
- Secure registration with email verification.
- Admin tools to manage users and monitor test activity.

### Results & Notifications
- View assessment results and student performance.
- Track test analytics through the admin dashboard.
- Receive real-time test updates and system notifications.

### Security & User Experience
- JWT authentication with refresh tokens.
- Cookie-based session management and protected routes.
- Responsive interface for a smooth experience across devices.

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB (local or cloud instance)
- Gmail account for SMTP email service
- Docker Desktop (optional, for Dockerized setup)

### Environment Variables

Sample environment files are available in the `frontend/` and `backend/` directories as `.env.example`.

Copy each example file to `.env` and add the required credentials.

### Local Development Setup

Clone the repository:

```bash
git clone https://github.com/Nidhibhide/LearnCode.git
cd LearnCode
```

Start the backend:

```bash
cd backend
npm install
npm run dev
```

In a separate terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

### Docker Setup (Optional)

Make sure Docker Desktop is installed and running, then run:

```bash
docker-compose up --build
```
