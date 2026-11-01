# AspirantAI Known Limitations & External Dependencies

1. **Third-Party AI & Vision API Keys**: The application includes built-in realistic pedagogical fallback engines for doubt resolution, OCR simulation, and PDF analysis. Connecting live third-party Gemini/OpenAI vision models requires setting `AI_API_KEY` in `server/.env`.
2. **Third-Party SMS Gateway**: Local development outputs OTPs to the secure server console and verification response for rapid testing. Production SMS delivery requires configuring an external provider (Twilio or Fast2SMS) in `server/.env`.
3. **Web Speech API Browser Variance**: Speech recognition operates using standard browser Web Speech APIs (`SpeechRecognition` / `webkitSpeechRecognition`), which require user microphone permission and Chromium/WebKit engine compatibility.
4. **Developer Portrait Asset**: A placeholder image and scalable SVG fallback are provided. The user can supply their preferred personal photograph by copying it to `client/public/assets/brand/abhishek-kumar-profile.webp`.
