/**
 * Central Brand and Application Configuration
 * AspirantAI — Created by Abhishek Kumar
 */

export const appConfig = {
  APP_NAME: 'AspirantAI',
  APP_TAGLINE: 'Prepare Smarter. Practice Better. Succeed Together.',
  APP_VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' }
  ],
  DEFAULT_TIMEZONE: 'Asia/Kolkata',

  // Creator & Developer Information
  CREATOR_NAME: 'Abhishek Kumar',
  CREATOR_ROLE: 'MERN Stack Developer',
  CREATOR_TAGLINE: 'Building Modern Web Experiences',
  CREATOR_CREDIT: 'Developed by Abhishek Kumar',
  CREATOR_PHOTO: '/assets/brand/abhishek-kumar-profile.jpg',
  CREATOR_PHOTO_FALLBACK: '/assets/brand/abhishek-kumar-profile.webp',
  CREATOR_BIO: 'I enjoy building modern, responsive and full-stack web applications that combine useful functionality with clean user experiences.',
  
  // Developer Technology Badges
  CREATOR_SKILLS: [
    'MongoDB',
    'Express.js',
    'React.js',
    'Node.js',
    'JavaScript',
    'REST APIs',
    'Git and GitHub'
  ],

  // Profile links - kept empty until provided by project owner (no invented links)
  CREATOR_LINKS: {
    github: '',
    linkedin: '',
    portfolio: '',
    email: ''
  },

  // Brand Metadata
  FOOTER_COPYRIGHT: '© 2026 AspirantAI. Developed by Abhishek Kumar.',
  
  // API URLs
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://aspirantai.onrender.com/api/v1' : '/api/v1'),
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || (import.meta.env.PROD ? 'https://aspirantai.onrender.com' : 'http://localhost:5001')
};

export default appConfig;
