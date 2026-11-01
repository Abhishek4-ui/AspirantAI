# AspirantAI Project Report

**Title:** AspirantAI: Premium 3D AI-Powered All-India Exam Preparation Platform  
**Developer & Author:** Abhishek Kumar  
**Specialization:** Full-Stack MERN Development  
**Academic / Production Year:** 2026  

---

## 1. Abstract
AspirantAI addresses the fragmentation in Indian competitive examination preparation. The platform combines a 3D visual learning environment with server-authoritative mock test scoring, bilingual question rendering, an automated midnight 100-question assessment generator, Spaced Repetition (SuperMemo SM-2) flashcards, and verified government vacancy tracking.

## 2. Key Modules Completed
1. **Security & Authentication**: Salted bcrypt password encryption, HMAC-SHA256 keyed 6-digit OTP challenges, replay attack prevention, and Role-Based Access Control (RBAC).
2. **Onboarding & Personalization**: Direct question workflow (`"Aap kis exam ki preparation kar rahe hain?"`), multiple preparation goals, and board stream selections.
3. **Daily AI 100-Question Exam Pipeline**: Server-side scoring with -0.66 negative marking, anti-leakage sanitization, idempotent submissions, and 100-question navigation palette.
4. **Live Quiz Engine**: Socket.IO multi-client synchronization, waiting lobbies, speed scoring, and live standings.
5. **AI Educational Suite**: Bilingual Doubt Solver, AI Study Coach, Voice Tutor with Web Speech API, OCR Image Solver, and PDF Analyzer.
6. **Adaptive Revision**: SuperMemo SM-2 flashcard scheduler and AI Mistake Notebook.
7. **Production DevOps**: Containerized Dockerfile and Docker Compose configurations, GitHub Actions CI workflow, and Swagger OpenAPI documentation.
