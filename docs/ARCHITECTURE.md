# AspirantAI System Architecture

## 1. High-Level Architecture

AspirantAI is structured as a decoupled, multi-tier full-stack system:

```
[ Client Layer: React 18 + Vite + Three.js + Tailwind ]
                       |
                       | HTTPS / REST + WSS / Socket.IO
                       v
[ API Gateway & Security: Helmet, Rate Limiter, CORS, JWT Auth, RBAC ]
                       |
      +----------------+----------------+
      |                                 |
[ REST API Handlers ]         [ Socket.IO Live Quiz Engine ]
(Express Controllers)         (Real-time State & Timers)
      |                                 |
      +----------------+----------------+
                       |
[ Data Access Layer: Mongoose Models & Validation ]
                       |
[ Primary Database: MongoDB Atlas / Local MongoDB ]
                       |
[ Background Services: Daily Midnight 100-Q Cron Scheduler (Asia/Kolkata) ]
```

## 2. Component Design

- **Client (`client/`)**: Pure JavaScript & JSX React application bundled with Vite. Contains 43 functional routes, 3D scenes with WebGL detection and procedural fallbacks, and centralized brand configuration.
- **Server (`server/`)**: Modular Node.js / Express server exposing REST endpoints under `/api/v1` and Socket.IO real-time channels for live tests.
- **Scheduling**: Node-Cron background workers configured for timezone `Asia/Kolkata` executing daily generation, publication, and notifications.
