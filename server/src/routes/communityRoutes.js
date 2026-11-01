const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/community/posts
 */
router.get('/posts', async (req, res, next) => {
  try {
    const { examTag } = req.query;
    const query = { isModerated: false };
    if (examTag && examTag !== 'All') query.examTag = examTag;

    const posts = await CommunityPost.find(query).sort({ createdAt: -1 }).limit(30);
    res.json({ success: true, count: posts.length, posts });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/community/posts
 */
router.post('/posts', protect, async (req, res, next) => {
  try {
    const { title, content, examTag } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const post = await CommunityPost.create({
      authorId: req.user._id,
      authorName: req.user.name,
      title,
      content,
      examTag: examTag || 'General',
      likes: [],
      comments: []
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/community/posts/:id/like
 */
router.post('/posts/:id/like', protect, async (req, res, next) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    const likedIndex = post.likes.indexOf(req.user._id);
    if (likedIndex > -1) {
      post.likes.splice(likedIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();

    res.json({ success: true, likesCount: post.likes.length, isLiked: likedIndex === -1 });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/community/posts/:id/comment
 */
router.post('/posts/:id/comment', protect, async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Comment cannot be blank.' });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });

    post.comments.push({
      authorId: req.user._id,
      authorName: req.user.name,
      content,
      createdAt: new Date()
    });
    await post.save();

    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
