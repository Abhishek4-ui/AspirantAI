const express = require('express');
const router = express.Router();
const Vacancy = require('../models/Vacancy');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route GET /api/v1/vacancies
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { isVerified: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { organization: { $regex: search, $options: 'i' } },
        { post: { $regex: search, $options: 'i' } },
        { notificationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const vacancies = await Vacancy.find(query).sort({ applicationEndDate: 1 });
    res.json({ success: true, count: vacancies.length, vacancies });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/vacancies/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    if (!vacancy) return res.status(404).json({ success: false, message: 'Vacancy not found.' });
    res.json({ success: true, vacancy });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/vacancies
 * Admin / ContentManager verified vacancy creation
 */
router.post('/', protect, authorize('admin', 'contentManager'), async (req, res, next) => {
  try {
    const vacancy = await Vacancy.create(req.body);
    res.status(201).json({ success: true, vacancy });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
