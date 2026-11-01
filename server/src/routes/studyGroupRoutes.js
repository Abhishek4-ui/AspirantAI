const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const StudyGroup = require('../models/StudyGroup');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/study-groups
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const groups = await StudyGroup.find({
      $or: [{ isPrivate: false }, { 'members.userId': req.user._id }]
    }).populate('creatorId', 'name');

    res.json({ success: true, count: groups.length, groups });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/study-groups
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { name, description, examCategory, isPrivate, weeklyStudyTargetHours } = req.body;
    const joinCode = isPrivate ? crypto.randomBytes(3).toString('hex').toUpperCase() : undefined;

    const group = await StudyGroup.create({
      name,
      description,
      examCategory,
      creatorId: req.user._id,
      isPrivate: !!isPrivate,
      joinCode,
      weeklyStudyTargetHours: weeklyStudyTargetHours || 25,
      members: [{ userId: req.user._id, role: 'admin', joinedAt: new Date() }]
    });

    res.status(201).json({ success: true, group });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/study-groups/join
 */
router.post('/join', protect, async (req, res, next) => {
  try {
    const { groupId, joinCode } = req.body;
    const group = await StudyGroup.findById(groupId);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });

    if (group.isPrivate && group.joinCode !== joinCode?.toUpperCase()) {
      return res.status(400).json({ success: false, message: 'Invalid private join code.' });
    }

    if (group.members.some(m => m.userId.toString() === req.user._id.toString())) {
      return res.status(400).json({ success: false, message: 'You are already a member of this study group.' });
    }

    group.members.push({ userId: req.user._id, role: 'member', joinedAt: new Date() });
    await group.save();

    res.json({ success: true, message: 'Successfully joined study group.', group });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
