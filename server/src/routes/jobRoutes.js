const express = require('express');
const router = express.Router();
const JobListing = require('../models/JobListing');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route GET /api/v1/jobs
 * List career jobs with filters
 */
router.get('/', async (req, res, next) => {
  try {
    const { category, roleType, workArrangement, location, search, fresherOnly } = req.query;
    const filter = { verified: true, isExpired: false, applicationDeadline: { $gte: new Date() } };

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (roleType && roleType !== 'All') {
      filter.roleType = roleType;
    }
    if (workArrangement && workArrangement !== 'All') {
      filter.workArrangement = workArrangement;
    }
    if (location && location !== 'All') {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { state: { $regex: location, $options: 'i' } }
      ];
    }
    if (fresherOnly === 'true') {
      filter.fresherEligible = true;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skillsRequired: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const jobs = await JobListing.find(filter).sort({ postedDate: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/jobs/:id
 * Get job details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const job = await JobListing.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job listing not found.' });
    }
    res.json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/jobs
 * Create verified job listing (Admin / Content Manager)
 */
router.post('/', protect, authorize('admin', 'contentManager'), async (req, res, next) => {
  try {
    const {
      title, company, category, roleType, workArrangement, location,
      state, city, fresherEligible, experienceRequired, salaryRange,
      skillsRequired, eligibility, officialApplyUrl, source, applicationDeadline, description
    } = req.body;

    if (!title || !company || !category || !officialApplyUrl || !source || !applicationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, category, official apply URL, verified source, and deadline are required.'
      });
    }

    const newJob = await JobListing.create({
      title,
      company,
      category,
      roleType: roleType || 'freshers',
      workArrangement: workArrangement || 'hybrid',
      location: location || 'India',
      state: state || 'All India',
      city: city || '',
      fresherEligible: fresherEligible !== undefined ? fresherEligible : true,
      experienceRequired: experienceRequired || '0 - 1 Years',
      salaryRange: salaryRange || 'As per industry norms',
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map(s => s.trim()) : []),
      eligibility: eligibility || 'B.Tech/BE/BCA/MCA/B.Sc IT fresh graduates',
      officialApplyUrl,
      source,
      postedDate: new Date(),
      applicationDeadline: new Date(applicationDeadline),
      verified: true,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      message: 'Verified job listing created successfully.',
      job: newJob
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
