const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route GET /api/v1/exams
 * Fetch all verified exams with category and search filtering
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { isActive: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { conductingAuthority: { $regex: search, $options: 'i' } }
      ];
    }

    const exams = await Exam.find(query).sort({ title: 1 });
    res.json({ success: true, count: exams.length, exams });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/exams/:idOrCode
 */
router.get('/:idOrCode', async (req, res, next) => {
  try {
    const { idOrCode } = req.params;
    let exam;

    if (idOrCode.match(/^[0-9a-fA-F]{24}$/)) {
      exam = await Exam.findById(idOrCode);
    }
    if (!exam) {
      exam = await Exam.findOne({ code: idOrCode.toUpperCase() });
    }

    if (!exam) {
      return res.status(404).json({ success: false, message: 'Exam details not found.' });
    }

    res.json({ success: true, exam });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/exams
 * Create or update exam (Admin / ContentManager only)
 */
router.post('/', protect, authorize('admin', 'contentManager'), async (req, res, next) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json({ success: true, exam });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
