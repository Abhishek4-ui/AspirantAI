# AspirantAI 3D Design System & Visual Philosophy

## 1. Visual Theme Architecture
- **Color Palette**:
  - Dark Navy backgrounds (`#060B18`, `#0B132B`, `#1C2541`).
  - Electric Blue lighting (`#0066FF`, `#00D4FF`).
  - Neon Cyan highlights (`#00F5D4`).
  - Deep Purple & Violet gradients (`#9D4EDD`, `#7209B7`).
- **Glassmorphism**:
  - `backdrop-filter: blur(16px)` with layered semi-transparent navy fills and subtle border lighting (`rgba(255, 255, 255, 0.08)`).
- **Depth & Ambient Shadows**:
  - Colored box-shadows (`shadow-glow-blue`, `shadow-glow-cyan`, `shadow-glow-purple`) that create layered optical depth.

## 2. 3D WebGL Implementation & Accessibility
- **React Three Fiber & Drei**: Used in `Hero3DScene.jsx` for floating distorted AI assistant orbs, knowledge polyhedra, and ambient starfield particles.
- **WebGL Capability Check**: Automatically detects WebGL support in the client browser. If unsupported or disabled, falls back to a high-performance CSS/SVG procedural hero.
- **Prefers-Reduced-Motion**: Animations respect operating system accessibility settings.
