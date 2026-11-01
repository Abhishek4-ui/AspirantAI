/**
 * Centralized Environment Configuration Validator for AspirantAI
 * Validates required variables and reports optional service statuses.
 */

function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const errors = [];
  const warnings = [];

  // Required Core Configuration
  if (!process.env.MONGODB_URI) {
    if (isProduction) {
      errors.push('MONGODB_URI is required in production. Please set your MongoDB Atlas connection string.');
    } else {
      warnings.push('MONGODB_URI is not set; defaulting to local MongoDB: mongodb://localhost:27017/aspirantai');
    }
  }

  if (!process.env.JWT_SECRET && !process.env.SESSION_SECRET) {
    if (isProduction) {
      errors.push('JWT_SECRET (or SESSION_SECRET) is required for secure authentication in production.');
    } else {
      warnings.push('JWT_SECRET not set; using development fallback secret.');
    }
  }

  // Optional Third-Party Services
  const serviceStatus = {
    mongodb: Boolean(process.env.MONGODB_URI),
    jwtAuth: Boolean(process.env.JWT_SECRET || process.env.SESSION_SECRET),
    googleOAuth: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    githubOAuth: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    geminiAI: Boolean(process.env.GEMINI_API_KEY),
    judge0Runner: Boolean(process.env.JUDGE0_API_URL),
    youtubeAPI: Boolean(process.env.YOUTUBE_API_KEY),
    emailProvider: Boolean(process.env.SMTP_HOST || process.env.RESEND_API_KEY)
  };

  if (!serviceStatus.googleOAuth) {
    warnings.push('Google OAuth credentials not configured (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET). Google Sign-In will report unconfigured.');
  }

  if (!serviceStatus.githubOAuth) {
    warnings.push('GitHub OAuth credentials not configured (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET). GitHub Sign-In will report unconfigured.');
  }

  if (!serviceStatus.geminiAI) {
    warnings.push('GEMINI_API_KEY not configured. AI Doubt Solver and Question Generator will run in deterministic fallback mode.');
  }

  if (!serviceStatus.judge0Runner) {
    warnings.push('JUDGE0_API_URL not configured. Multi-language code runner will report runner unconfigured.');
  }

  if (errors.length > 0) {
    console.error('\n❌ [CONFIG ERROR] Environment configuration failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    if (isProduction) {
      process.exit(1);
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log('\n⚙️ [CONFIG] AspirantAI Environment Status:');
    Object.entries(serviceStatus).forEach(([service, active]) => {
      console.log(`  - ${service.padEnd(16)}: ${active ? '✅ Configured' : '⚠️ Unconfigured (Optional)'}`);
    });
    console.log('');
  }

  return { errors, warnings, serviceStatus };
}

module.exports = { validateEnv };
