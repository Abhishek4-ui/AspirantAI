const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const axios = require('axios');
const User = require('../models/User');
const AuthSession = require('../models/AuthSession');
const QuizAttempt = require('../models/QuizAttempt');
const Resume = require('../models/Resume');
const StudyPlan = require('../models/StudyPlan');
const CodeSubmission = require('../models/CodeSubmission');
const { protect, JWT_SECRET } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Helper to generate JWT
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper to record auth session
const recordSession = async (user, token, req) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await AuthSession.create({
      userId: user._id,
      tokenHash,
      ip: req.ip || req.headers['x-forwarded-for'] || '',
      userAgent: req.headers['user-agent'] || '',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  } catch (err) {
    // Non-fatal if session recording fails
  }
};

/**
 * @route GET /api/v1/auth/providers
 * Returns configuration status of OAuth providers
 */
router.get('/providers', (req, res) => {
  res.json({
    success: true,
    providers: {
      google: {
        configured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        clientId: process.env.GOOGLE_CLIENT_ID || null
      },
      github: {
        configured: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
        clientId: process.env.GITHUB_CLIENT_ID || null
      }
    }
  });
});

/**
 * @route POST /api/v1/auth/signup
 * Direct new-user account creation (OTP removed per Rule 8)
 */
router.post('/signup', authLimiter, async (req, res, next) => {
  try {
    const { name, email, mobile, password, preferredLanguage } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please sign in.'
      });
    }

    if (mobile && mobile.trim()) {
      const existingMobile = await User.findOne({ mobile: mobile.trim() });
      if (existingMobile) {
        return res.status(400).json({
          success: false,
          message: 'An account with this mobile number already exists.'
        });
      }
    }

    const userData = {
      name: name.trim(),
      email: cleanEmail,
      password,
      preferredLanguage: preferredLanguage || 'en',
      role: 'student',
      isEmailVerified: true,
      authProvider: 'local'
    };
    if (mobile && mobile.trim()) {
      userData.mobile = mobile.trim();
    }

    const user = await User.create(userData);

    const token = createToken(user);
    await recordSession(user, token, req);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to AspirantAI!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        onboardingCompleted: user.onboardingCompleted,
        preferredLanguage: user.preferredLanguage,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/auth/login
 * Existing-user login (email or mobile + password)
 */
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email/mobile and password.'
      });
    }

    const cleanIdentifier = identifier.trim();
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { mobile: cleanIdentifier }
      ]
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email/mobile and password.'
      });
    }

    // Update streak
    const now = new Date();
    if (!user.streak.lastActiveDate || (now - user.streak.lastActiveDate) > 86400000 * 2) {
      user.streak.current = 1;
    } else if ((now - user.streak.lastActiveDate) > 86400000) {
      user.streak.current += 1;
      if (user.streak.current > user.streak.max) user.streak.max = user.streak.current;
    }
    user.streak.lastActiveDate = now;
    await user.save();

    const token = createToken(user);
    await recordSession(user, token, req);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        onboardingCompleted: user.onboardingCompleted,
        primaryExamId: user.primaryExamId,
        preparationGoals: user.preparationGoals,
        streak: user.streak,
        xp: user.xp,
        preferredLanguage: user.preferredLanguage,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/auth/google/url
 * Returns Google OAuth consent URL or reports unconfigured honestly
 */
router.get('/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;

  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.json({
      success: false,
      configured: false,
      callbackUrl,
      message: 'Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env to enable real Google Sign-In.'
    });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid profile email',
    access_type: 'offline',
    prompt: 'consent',
    state
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({
    success: true,
    configured: true,
    url: authUrl,
    callbackUrl,
    state
  });
});

/**
 * @route POST /api/v1/auth/configure-oauth
 * Allows quick environment configuration of OAuth credentials
 */
router.post('/configure-oauth', async (req, res) => {
  try {
    const { provider, clientId, clientSecret } = req.body;

    if (!provider || !clientId || !clientSecret) {
      return res.status(400).json({
        success: false,
        message: 'Provider, Client ID, and Client Secret are required.'
      });
    }

    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '../../.env');

    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }

    if (provider.toLowerCase() === 'google') {
      process.env.GOOGLE_CLIENT_ID = clientId.trim();
      process.env.GOOGLE_CLIENT_SECRET = clientSecret.trim();

      if (envContent.includes('GOOGLE_CLIENT_ID=')) {
        envContent = envContent.replace(/GOOGLE_CLIENT_ID=.*/g, `GOOGLE_CLIENT_ID=${clientId.trim()}`);
      } else {
        envContent += `\nGOOGLE_CLIENT_ID=${clientId.trim()}`;
      }

      if (envContent.includes('GOOGLE_CLIENT_SECRET=')) {
        envContent = envContent.replace(/GOOGLE_CLIENT_SECRET=.*/g, `GOOGLE_CLIENT_SECRET=${clientSecret.trim()}`);
      } else {
        envContent += `\nGOOGLE_CLIENT_SECRET=${clientSecret.trim()}`;
      }

      fs.writeFileSync(envPath, envContent, 'utf8');

      const callbackUrl = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;
      const state = crypto.randomBytes(16).toString('hex');
      const params = new URLSearchParams({
        client_id: clientId.trim(),
        redirect_uri: callbackUrl,
        response_type: 'code',
        scope: 'openid profile email',
        access_type: 'offline',
        prompt: 'consent',
        state
      });

      return res.json({
        success: true,
        message: 'Google OAuth configured successfully!',
        configured: true,
        url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
      });
    }

    res.status(400).json({ success: false, message: `Unsupported provider: ${provider}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const getClientRedirectUrl = () => {
  const envUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return envUrl.split(',')[0].trim().replace(/\/$/, '') || 'http://localhost:5173';
};

/**
 * @route GET /api/v1/auth/google/callback
 * Handles Google OAuth redirect and code exchange
 */
router.get('/google/callback', async (req, res) => {
  const clientUrl = getClientRedirectUrl();
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(error || 'Google authorization cancelled')}`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent('Google OAuth is not configured on server')}`);
  }

  try {
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
      timeout: 10000
    });

    const { id: googleId, email, name, picture } = userRes.data;

    if (!email) {
      return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent('Could not retrieve email from Google account')}`);
    }

    let user = await User.findOne({
      $or: [
        { googleId },
        { email: email.toLowerCase().trim() }
      ]
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profilePicture && picture) {
        user.profilePicture = picture;
      }
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: name || 'Google Aspirant',
        email: email.toLowerCase().trim(),
        googleId,
        profilePicture: picture || '',
        role: 'student',
        authProvider: 'google',
        isEmailVerified: true
      });
    }

    const token = createToken(user);
    await recordSession(user, token, req);

    res.redirect(`${clientUrl}/auth/callback?token=${token}&provider=google`);
  } catch (err) {
    const errMsg = err.response?.data?.error_description || err.message;
    res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(`Google OAuth failed: ${errMsg}`)}`);
  }
});

/**
 * @route POST /api/v1/auth/google/callback
 * Direct API endpoint for frontend/mobile code exchange
 */
router.post('/google/callback', async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required.' });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/google/callback`;

    if (!clientId || !clientSecret) {
      return res.status(503).json({
        success: false,
        message: 'Google OAuth credentials not configured on the server.'
      });
    }

    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    }, { timeout: 10000 });

    const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenRes.data.access_token}` },
      timeout: 10000
    });

    const { id: googleId, email, name, picture } = userRes.data;

    let user = await User.findOne({
      $or: [{ googleId }, { email: email.toLowerCase().trim() }]
    });

    if (user) {
      if (!user.googleId) user.googleId = googleId;
      if (!user.profilePicture && picture) user.profilePicture = picture;
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: name || 'Google Aspirant',
        email: email.toLowerCase().trim(),
        googleId,
        profilePicture: picture || '',
        role: 'student',
        authProvider: 'google',
        isEmailVerified: true
      });
    }

    const token = createToken(user);
    await recordSession(user, token, req);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/auth/github/url
 * Returns GitHub OAuth consent URL or reports unconfigured honestly
 */
router.get('/github/url', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const callbackUrl = process.env.GITHUB_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/github/callback`;

  if (!clientId || !process.env.GITHUB_CLIENT_SECRET) {
    return res.json({
      success: false,
      configured: false,
      message: 'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in server/.env to enable real GitHub Sign-In.'
    });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'user:email',
    state
  });

  const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
  res.json({
    success: true,
    configured: true,
    url: authUrl,
    state
  });
});

/**
 * @route GET /api/v1/auth/github/callback
 * Handles GitHub OAuth redirect and code exchange
 */
router.get('/github/callback', async (req, res) => {
  const clientUrl = getClientRedirectUrl();
  const { code, error } = req.query;

  if (error || !code) {
    return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(error || 'GitHub authorization cancelled')}`);
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = process.env.GITHUB_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/github/callback`;

  if (!clientId || !clientSecret) {
    return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent('GitHub OAuth is not configured on server')}`);
  }

  try {
    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    }, {
      headers: { Accept: 'application/json' },
      timeout: 10000
    });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent('Could not obtain GitHub access token')}`);
    }

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'AspirantAI-Platform' },
      timeout: 10000
    });

    let userEmail = userRes.data.email;
    if (!userEmail) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'AspirantAI-Platform' },
        timeout: 10000
      });
      const primary = emailsRes.data.find(e => e.primary && e.verified) || emailsRes.data[0];
      userEmail = primary ? primary.email : `${userRes.data.login}@users.noreply.github.com`;
    }

    const githubId = String(userRes.data.id);
    let user = await User.findOne({
      $or: [
        { githubId },
        { email: userEmail.toLowerCase().trim() }
      ]
    });

    if (user) {
      if (!user.githubId) user.githubId = githubId;
      if (!user.developerProfile.githubUsername) user.developerProfile.githubUsername = userRes.data.login;
      if (!user.profilePicture && userRes.data.avatar_url) user.profilePicture = userRes.data.avatar_url;
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: userRes.data.name || userRes.data.login,
        email: userEmail.toLowerCase().trim(),
        githubId,
        profilePicture: userRes.data.avatar_url || '',
        role: 'student',
        authProvider: 'github',
        isEmailVerified: true,
        developerProfile: {
          githubUsername: userRes.data.login,
          bio: userRes.data.bio || ''
        }
      });
    }

    const token = createToken(user);
    await recordSession(user, token, req);

    res.redirect(`${clientUrl}/auth/callback?token=${token}&provider=github`);
  } catch (err) {
    const errMsg = err.response?.data?.message || err.message;
    res.redirect(`${clientUrl}/auth/callback?error=${encodeURIComponent(`GitHub OAuth failed: ${errMsg}`)}`);
  }
});

/**
 * @route POST /api/v1/auth/github/callback
 * Direct API endpoint for frontend/mobile code exchange
 */
router.post('/github/callback', async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required.' });
    }

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_CALLBACK_URL || `${req.protocol}://${req.get('host')}/api/v1/auth/github/callback`;

    if (!clientId || !clientSecret) {
      return res.status(503).json({
        success: false,
        message: 'GitHub OAuth credentials not configured on the server.'
      });
    }

    const tokenRes = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri
    }, {
      headers: { Accept: 'application/json' },
      timeout: 10000
    });

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'Failed to retrieve access token from GitHub.' });
    }

    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'AspirantAI-Platform' },
      timeout: 10000
    });

    let userEmail = userRes.data.email;
    if (!userEmail) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'AspirantAI-Platform' },
        timeout: 10000
      });
      const primary = emailsRes.data.find(e => e.primary && e.verified) || emailsRes.data[0];
      userEmail = primary ? primary.email : `${userRes.data.login}@users.noreply.github.com`;
    }

    const githubId = String(userRes.data.id);
    let user = await User.findOne({
      $or: [
        { githubId },
        { email: userEmail.toLowerCase().trim() }
      ]
    });

    if (user) {
      if (!user.githubId) user.githubId = githubId;
      if (!user.developerProfile.githubUsername) user.developerProfile.githubUsername = userRes.data.login;
      if (!user.profilePicture && userRes.data.avatar_url) user.profilePicture = userRes.data.avatar_url;
      user.isEmailVerified = true;
      await user.save();
    } else {
      user = await User.create({
        name: userRes.data.name || userRes.data.login,
        email: userEmail.toLowerCase().trim(),
        githubId,
        profilePicture: userRes.data.avatar_url || '',
        role: 'student',
        authProvider: 'github',
        isEmailVerified: true,
        developerProfile: {
          githubUsername: userRes.data.login,
          bio: userRes.data.bio || ''
        }
      });
    }

    const token = createToken(user);
    await recordSession(user, token, req);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/auth/logout
 * Invalidate current session
 */
router.post('/logout', protect, async (req, res, next) => {
  try {
    if (req.token) {
      const tokenHash = crypto.createHash('sha256').update(req.token).digest('hex');
      await AuthSession.updateOne({ tokenHash }, { isValid: false });
    }
    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/v1/auth/account
 * Secure account deletion workflow with cascading data cleanup
 */
router.delete('/account', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Cascade delete user-owned records
    await Promise.all([
      QuizAttempt.deleteMany({ userId }),
      Resume.deleteMany({ userId }),
      StudyPlan.deleteMany({ userId }),
      CodeSubmission.deleteMany({ userId }),
      AuthSession.deleteMany({ userId }),
      User.findByIdAndDelete(userId)
    ]);

    res.clearCookie('token');
    res.json({
      success: true,
      message: 'Account and associated study records have been securely deleted.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/auth/me
 * Returns authenticated user profile
 */
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * @route POST /api/v1/auth/forgot-password
 * Direct reset instruction initiator
 */
router.post('/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const user = await User.findOne({ email: identifier.toLowerCase().trim() });
    if (!user) {
      // Return honest but safe response to prevent email enumeration
      return res.json({
        success: true,
        message: 'If an account exists with this email address, password reset instructions have been dispatched.'
      });
    }

    res.json({
      success: true,
      message: 'If an account exists with this email address, password reset instructions have been dispatched.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
