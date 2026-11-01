# AspirantAI — Complete AI-Powered Exam Preparation, Coding, Learning, Internship & Career Platform

> **Prepare Smarter. Code Better. Get Hired. Succeed Together.**

**Lead Architect & Developer:** Abhishek Kumar (MERN Stack Developer)  
**Timezone Standard:** `Asia/Kolkata` (IST)  
**License:** Free to use platform. Zero paywalls. No Docker.  

---

## 🌟 Executive Overview

**AspirantAI** is a comprehensive, production-oriented full-stack web application engineered for competitive exam aspirants (UPSC, BPSC, GATE CSE/DA, SSC, Banking, Railways), computer science students, and tech job seekers.

The platform unites exam preparation, CBT examination simulation, sandboxed algorithmic coding, structured computer science learning paths, verified tech internships, entry-level job opportunities, AI mock interviews, and an ATS-optimized resume & cover letter builder into a single modern web application.

---

## 🚀 Key Modules & Capabilities

### 1. Authentication & Security (Rules 7 & 8 Compliant)
- **OAuth 2.0 Integration**: Built-in support for Google OAuth and GitHub OAuth with automated user profile population and token creation.
- **Direct Email Registration**: Removed all SMS and email OTP barriers per project specifications. New users are immediately registered and granted active sessions.
- **Role-Based Access Control (RBAC)**: Enforces server-side permissions for `student`, `contentReviewer`, and `admin`.
- **Session Revocation & Account Deletion**: Full cascading deletion workflow wiping all candidate data upon request.

### 2. Full-Length CBT Exam Simulator & Verified PYQ Library
- **TCS-iON / NTA-Style Console**: Full-screen question palette with interactive color states (Answered, Not Answered, Marked for Review, Not Visited).
- **Countdown Timers & Auto-Submit**: Server-synchronized countdown timer with automatic test submission upon expiration.
- **Server-Authoritative Scoring**: Computes net score with negative marking, time-per-question analysis, and topic breakdowns.
- **Verified PYQ Provenance**: Every official PYQ paper includes verified source URLs (upsc.gov.in, bpsc.bih.nic.in, ssc.gov.in, gate2024.iisc.ac.in).

### 3. Central AI Question Generation Engine
- **Strict Schema Enforcement**: Validates question structure, options keys, correct answers, and conceptual explanations.
- **Deduplication Engine**: Normalizes and hashes question prompts to prevent repetitive question sets.
- **Multi-Format Support**: Single-choice, multiple-choice, numerical, true/false, coding, SQL, and subjective questions.
- **Honest Attribution**: Strictly tags questions as `ai_generated` with review statuses unless independently verified.

### 4. AI Mock Interview Practice Suite
- **Role-Specific Simulation**: Tailored questions for Software Engineers, Frontend, Backend, Full Stack, and Data Science.
- **Tracks**: Technical Deep Dive, DSA & Algorithmic Logic, SQL & Database Systems, and Behavioral (STAR method).
- **Pedagogical Scoring & Feedback**: Evaluates answers out of 10 with actionable strengths, improvement notes, and model answers.

### 5. Dedicated Coding Practice & Monaco Sandbox
- **Multi-Language Support**: Interactive Monaco code editor for JavaScript, Python, Java, C++, and C.
- **Sandboxed Execution**: Integrated with Judge0 API with strict limits, sample test cases, and hidden test cases protected from client leakage.
- **Honest Status Handling**: If external execution service is not configured, provides a clear, honest status report and saves code history.

### 6. Technical Resume Builder, AI Reviewer & Cover Letter Generator
- **Live Real-Time Preview**: Multiple templates (Modern Dark, Classic, Minimal, Tech).
- **AI Resume Reviewer**: Algorithmic scoring of action verbs, quantifiable metrics, missing target role keywords, and printable PDF export.
- **Targeted Cover Letter Generator**: Synthesizes professional cover letters comparing student skills to job descriptions.

### 7. Dedicated Internship & Fresher Career Portals
- **20+ Categories**: Software Development, Frontend, Backend, Full-Stack, AI/ML, Data Science, Cybersecurity, Cloud, DevOps, Research Internships.
- **Direct Official Links**: Connects candidates directly to corporate career pages with application tracking pipeline.

### 8. System Administration & Configuration Telemetry
- **Provider Status Board**: Real-time status of MongoDB Atlas, JWT Auth, Google OAuth, GitHub OAuth, Gemini AI, Judge0, and YouTube API without ever exposing secret values.
- **Audit Logging**: Immutable tracking of administrative role changes and question reviews.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript (ES modules, JSX), React Router v6, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Recharts.
- **Backend**: Node.js, Express.js (CommonJS), MongoDB Atlas & Mongoose, Helmet, CORS, Express-Rate-Limit, SQLite in-memory engine (`sql.js`).
- **Testing**: Jest, Supertest (100% test pass rate across 31 integration tests).
- **Compliance**: Zero TypeScript, zero TSX, zero Docker, zero fake data, no payment gateways or paywalls.

---

## 💻 Quick Start & Local Run

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on port 27017 or a MongoDB Atlas connection string.

### 1. Installation
```bash
# Navigate to project directory
cd AspirantAI

# Install all dependencies across root, server, and client
npm run install:all
```

### 2. Environment Configuration
Copy `.env.example` templates to `.env`:
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

To enable Google or GitHub OAuth, add credentials in `server/.env`:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback
```
*(If OAuth credentials are left blank, AspirantAI runs smoothly using standard email/password authentication and honestly reports OAuth unconfigured).*

### 3. Seed Database
Seeds 100+ validated bilingual questions, coding problems, verified internships, fresher jobs, official exams, and calendar events:
```bash
npm run seed
```

### 4. Run Development Servers
Starts backend (`http://localhost:5000`) and frontend (`http://localhost:5173`):
```bash
npm run dev
```

### 5. Demo Credentials
- **Student Account**: `student@aspirantai.in` / `StudentPassword@123`
- **Administrator Account**: `admin@aspirantai.in` / `AdminPassword@123`
- **Content Manager**: `editor@aspirantai.in` / `EditorPassword@123`

---

## 🧪 Automated Testing

To run the backend integration test suite (31 automated integration tests):
```bash
npm test
```

To run a production client build:
```bash
npm run build
```

---

## 🚀 Production Deployment Instructions

### 1. Frontend Deployment (Vercel / Render Static Site)

#### Option A: Vercel
1. Push repository to GitHub.
2. In Vercel, import the repository and set **Root Directory** to `client`.
3. Set **Framework Preset** to `Vite`.
4. Configure Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api/v1`
   - `VITE_SOCKET_URL`: `https://your-backend-api.onrender.com`
5. Deploy.

#### Option B: Render (Static Site)
1. In Render, create a new **Static Site** connected to your repository.
2. If **Root Directory** is left blank (repository root):
   - **Build Command**: `cd client && npm install --include=dev && npm run build` (or `npm run build`)
   - **Publish Directory**: `client/dist`
3. If **Root Directory** is set to `client`:
   - **Build Command**: `npm install --include=dev && npm run build`
   - **Publish Directory**: `dist`
4. Configure Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com/api/v1`
   - `VITE_SOCKET_URL`: `https://your-backend-api.onrender.com`
5. Deploy.

### 2. Backend Deployment (Render)
1. In Render, create a new **Web Service** connected to your repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node src/server.js`
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/aspirantai?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<your_production_secret_key>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
6. Deploy.

---

## 👨‍💻 Creator & Architectural Credit

Designed and engineered by **Abhishek Kumar**  
*MERN Stack Developer — Building Modern Web Experiences*  
© 2026 AspirantAI. All rights reserved.
# AspirantAI
