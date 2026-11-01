# AspirantAI Asset Manifest & Developer Photo Instructions

## 1. Brand Asset Inventory
All static visual assets are located under `client/public/assets/`:

- **Brand Logos & Icons**:
  - `client/public/assets/brand/aspirantai-logo.svg` - Primary full SVG logo with 3D crystal icon.
  - `client/public/assets/brand/aspirantai-icon.svg` - Square application icon for PWA and favicon.
  - `client/public/assets/brand/abhishek-kumar-profile.webp` - Developer photograph location.
  - `client/public/assets/brand/abhishek-kumar-profile.svg` - Scalable vector fallback profile illustration.

## 2. Developer Photograph Integration Instructions
As requested by Section 4:
To update the developer photograph with your personal high-resolution portrait:
1. Place your personal photograph file in the folder:
   ```
   AspirantAI/client/public/assets/brand/abhishek-kumar-profile.webp
   ```
2. If your photo is in `.jpg` or `.png` format, you can either convert it to WebP or retain the original extension and update `CREATOR_PHOTO` in `client/src/config/appConfig.js`.
3. The component `DeveloperProfile.jsx` automatically uses responsive image sizing with the alt text `"Abhishek Kumar, MERN Stack Developer"` and includes automatic graceful fallback if the file is pending upload.
