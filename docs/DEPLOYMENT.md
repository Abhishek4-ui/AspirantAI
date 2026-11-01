# AspirantAI Deployment Guide

## 1. Local Development (macOS / Linux / Windows)
```bash
# 1. Start MongoDB Community service
brew services start mongodb-community

# 2. Seed initial data
cd AspirantAI/server && npm run seed

# 3. Start development servers
cd .. && npm run dev
```

## 2. Production Docker Deployment
```bash
# Build and orchestrate MongoDB, Redis, Backend, and Frontend (Nginx)
docker-compose up --build -d
```

## 3. Cloud Deployment

### Backend (Render / Railway / AWS EC2)
- Environment Variables required:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aspirantai`
  - `CLIENT_URL=https://aspirantai.vercel.app`
  - `SESSION_SECRET=<random-64-char-hex>`
  - `OTP_HASH_SECRET=<random-64-char-hex>`
- Build Command: `npm ci`
- Start Command: `node src/server.js`

### Frontend (Vercel / Netlify / Cloudflare Pages / Render Static Site)
- **Vercel / Netlify / Cloudflare Pages**:
  - Framework Preset: `Vite`
  - Root Directory: `client`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- **Render (Static Site)**:
  - If Root Directory is repository root (`.`):
    - Build Command: `cd client && npm install --include=dev && npm run build` (or `npm run build`)
    - Publish Directory: `client/dist`
  - If Root Directory is `client`:
    - Build Command: `npm install --include=dev && npm run build`
    - Publish Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL=https://your-backend-service.onrender.com/api/v1`
  - `VITE_SOCKET_URL=https://your-backend-service.onrender.com`
