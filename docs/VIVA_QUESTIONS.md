# AspirantAI Viva Voce & Technical Defense Guide

### Q1: Why was server-side scoring implemented instead of grading quizzes in the client browser?
**A:** Client-side grading requires sending answer keys or correct option values to the browser, making them trivial to inspect and compromise via browser developer tools. In AspirantAI, the server strips `correctAnswer` and explanations from the test payload. Evaluation occurs strictly on the backend, ensuring idempotent scoring and negative-marking integrity.

### Q2: How does the OTP challenge thwart replay attacks?
**A:** OTP challenges are stored with `isUsed: false` and keyed HMAC-SHA256 hashes. Once verified, the challenge record is atomically updated to `isUsed: true`. Any subsequent submission with the identical token is rejected immediately.

### Q3: How is SuperMemo SM-2 implemented in the flashcard module?
**A:** When a user reviews a card and rates recall difficulty from 0 to 5, the SM-2 algorithm adjusts the card's `easeFactor` (minimum 1.3), increments repetition counts, calculates the next interval (in days), and computes `nextReviewDate = now + interval`.

### Q4: How does AspirantAI ensure smooth 3D performance on low-end or mobile devices?
**A:** Through WebGL feature detection, procedural CSS/SVG fallback scenes, lazy loading, instanced geometries, and honoring the `prefers-reduced-motion` media query.
