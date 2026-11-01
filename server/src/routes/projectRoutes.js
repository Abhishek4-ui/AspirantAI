const express = require('express');
const router = express.Router();
const axios = require('axios');
const Project = require('../models/Project');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/projects
 * List guided project templates
 */
router.get('/', async (req, res, next) => {
  try {
    const { domain, difficulty, search } = req.query;
    const filter = {};

    if (domain && domain !== 'All') {
      filter.domain = domain;
    }
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { techStack: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const projects = await Project.find(filter).sort({ difficulty: 1, createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/projects/:slug
 * Get specific project guide details
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project guide not found.' });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/projects/developer/:username
 * Public developer profile and GitHub integration
 */
router.get('/developer/:username', async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [
        { email: req.params.username },
        { 'developerProfile.githubUsername': req.params.username }
      ]
    }).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'Developer profile not found.' });
    }

    let githubData = null;
    if (user.developerProfile?.githubUsername) {
      try {
        const ghUser = await axios.get(`https://api.github.com/users/${user.developerProfile.githubUsername}`, {
          timeout: 4000,
          headers: { 'User-Agent': 'AspirantAI-Platform' }
        });
        const ghRepos = await axios.get(`https://api.github.com/users/${user.developerProfile.githubUsername}/repos?sort=updated&per_page=6`, {
          timeout: 4000,
          headers: { 'User-Agent': 'AspirantAI-Platform' }
        });
        githubData = {
          profile: ghUser.data,
          publicRepos: ghRepos.data.map(r => ({
            name: r.name,
            description: r.description,
            htmlUrl: r.html_url,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            updatedAt: r.updated_at
          }))
        };
      } catch (err) {
        // Honest handling: GitHub API rate limited or user not found
        githubData = {
          profile: null,
          error: 'GitHub profile could not be reached or reached API rate limit.'
        };
      }
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.developerProfile?.isPublic ? user.email : undefined,
        developerProfile: user.developerProfile,
        streak: user.streak,
        xp: user.xp,
        githubData
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/v1/projects/developer/me
 * Update logged-in user developer profile
 */
router.put('/developer/me', protect, async (req, res, next) => {
  try {
    const { bio, githubUsername, linkedinUrl, portfolioUrl, skills, isPublic } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (!user.developerProfile) {
      user.developerProfile = {};
    }

    if (bio !== undefined) user.developerProfile.bio = bio;
    if (githubUsername !== undefined) user.developerProfile.githubUsername = githubUsername.trim();
    if (linkedinUrl !== undefined) user.developerProfile.linkedinUrl = linkedinUrl.trim();
    if (portfolioUrl !== undefined) user.developerProfile.portfolioUrl = portfolioUrl.trim();
    if (skills !== undefined) user.developerProfile.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (isPublic !== undefined) user.developerProfile.isPublic = isPublic;

    await user.save();

    res.json({
      success: true,
      message: 'Developer profile updated successfully.',
      developerProfile: user.developerProfile
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
