const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtube/youtubeService');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/youtube/search
 * Real YouTube Data API v3 Search with caching & quota safety
 */
router.get('/search', async (req, res, next) => {
  try {
    const {
      q = '',
      examCategory = 'All',
      subject = '',
      topic = '',
      language = 'en',
      type = 'video',
      pageToken = '',
      maxResults = 12
    } = req.query;

    const results = await youtubeService.searchYouTube({
      q,
      examCategory,
      subject,
      topic,
      language,
      type,
      pageToken,
      maxResults
    });

    res.json(results);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/youtube/curated
 * Curated syllabus-aligned playlists and lectures for all exams
 */
router.get('/curated', (req, res) => {
  const { examCategory = 'All', subject = '', topic = '', search = '' } = req.query;
  const items = youtubeService.filterCuratedVideos(examCategory, subject, topic, search);

  res.json({
    success: true,
    count: items.length,
    items
  });
});

/**
 * @route GET /api/v1/youtube/progress
 * Get authenticated user's bookmarks, completed lectures, and recently watched
 */
router.get('/progress', protect, async (req, res, next) => {
  try {
    const progress = await youtubeService.getUserLearningProgress(req.user._id);
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/youtube/bookmark
 * Bookmark/unbookmark a lecture or playlist
 */
router.post('/bookmark', protect, async (req, res, next) => {
  try {
    const result = await youtubeService.toggleBookmark(req.user._id, req.body);
    res.json({
      success: true,
      bookmarked: result.bookmarked,
      message: result.bookmarked ? 'Lecture bookmarked.' : 'Bookmark removed.'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/youtube/complete
 * Mark video as completed and award XP
 */
router.post('/complete', protect, async (req, res, next) => {
  try {
    const result = await youtubeService.markCompleted(req.user._id, req.body);
    res.json({
      success: true,
      completed: true,
      message: 'Lesson marked as completed. +15 XP awarded!'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
