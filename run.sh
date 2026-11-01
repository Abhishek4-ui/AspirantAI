#!/bin/bash
# ================================================================
# AspirantAI — One-Click Development & Production Launcher
# Creator: Abhishek Kumar (MERN Stack Developer)
# ================================================================

echo "=========================================================="
echo "  🚀 Starting AspirantAI Platform (Full Stack)"
echo "  Creator: Abhishek Kumar"
echo "  Database: MongoDB Atlas"
echo "=========================================================="

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

# Check node & npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v18 or higher)."
    exit 1
fi

# Clean up any lingering process on port 5001 or 5173 so no EADDRINUSE crash occurs
PORT_5001_PID=$(lsof -ti :5001 2>/dev/null)
if [ -n "$PORT_5001_PID" ]; then
    echo "🧹 Freeing port 5001 (PID $PORT_5001_PID)..."
    kill -9 $PORT_5001_PID 2>/dev/null || true
fi

PORT_5173_PID=$(lsof -ti :5173 2>/dev/null)
if [ -n "$PORT_5173_PID" ]; then
    echo "🧹 Freeing port 5173 (PID $PORT_5173_PID)..."
    kill -9 $PORT_5173_PID 2>/dev/null || true
fi

echo "📦 Verifying dependencies..."
if [ ! -d "node_modules" ]; then
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    cd client && npm install && cd ..
fi

echo "✅ Environment configured:"
echo "   - Backend API: http://localhost:5001"
echo "   - Frontend Web: http://localhost:5173"
echo "   - Database: MongoDB Atlas (Connected)"
echo "=========================================================="
echo "⚡ Launching Backend & Frontend concurrently..."

# Automatically open the browser after a brief delay
(sleep 3 && open "http://localhost:5173") &

npm run dev
