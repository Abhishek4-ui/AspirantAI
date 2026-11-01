const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route GET /api/v1/internships
 * List internships with rich filters
 */
router.get('/', async (req, res, next) => {
  try {
    const { domain, workType, compensationType, search, isExpired } = req.query;
    const filter = { verified: true };

    if (isExpired !== 'true') {
      filter.isExpired = false;
      filter.applicationDeadline = { $gte: new Date() };
    }
    if (domain && domain !== 'All') {
      filter.domain = domain;
    }
    if (workType && workType !== 'All') {
      filter.workType = workType;
    }
    if (compensationType && compensationType !== 'All') {
      filter.compensationType = compensationType;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search, 'i')] } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const internships = await Internship.find(filter).sort({ applicationDeadline: 1 });

    res.json({
      success: true,
      count: internships.length,
      internships
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/internships/:id
 * Get single internship details
 */
router.get('/:id', async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found.' });
    }
    res.json({
      success: true,
      internship
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/internships
 * Create a new verified internship listing (Admin / Content Manager)
 */
router.post('/', protect, authorize('admin', 'contentManager'), async (req, res, next) => {
  try {
    const {
      title, company, domain, workType, compensationType, stipend,
      duration, termType, location, applicationDeadline, officialUrl,
      requiredSkills, eligibility, source, description
    } = req.body;

    if (!title || !company || !domain || !applicationDeadline || !officialUrl || !source) {
      return res.status(400).json({
        success: false,
        message: 'Title, company, domain, deadline, official URL, and verified source attribution are required.'
      });
    }

    const newInternship = await Internship.create({
      title,
      company,
      domain,
      workType: workType || 'remote',
      compensationType: compensationType || 'paid',
      stipend: stipend || 'Disclosed upon selection',
      duration: duration || '3 Months',
      termType: termType || 'full-time',
      location: location || 'India',
      applicationDeadline: new Date(applicationDeadline),
      officialUrl,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      eligibility: eligibility || 'Open to technical undergraduates & freshers',
      source,
      description: description || '',
      verified: true,
      lastCheckedDate: new Date()
    });

    res.status(201).json({
      success: true,
      message: 'Verified internship listing created.',
      internship: newInternship
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
