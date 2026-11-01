# AspirantAI Animation Specifications

- **Framer Motion**: Smooth entrance transitions (`initial={{ opacity: 0, y: 15 }}`, `animate={{ opacity: 1, y: 0 }}`) across view containers and modal dialogs.
- **Card Perspective Tilts**: Subtle interactive hover scaling (`whileHover={{ y: -4, rotateX: 2 }}`) applied to exam goal cards and feature portals.
- **Audio Waveform**: Active animated waveforms during AI Voice Tutor speech and microphone recording modes.
- **Achievement Confetti**: Triggered via `canvas-confetti` upon completing test submissions.
- **Countdown Pulses**: Warning pulses when quiz timer is below 5 minutes.
