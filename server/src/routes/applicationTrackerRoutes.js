const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const { protect } = require('../middleware/auth');

/**
 * @route GET /api/v1/applications
 * Get current user's job & internship application pipeline
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };
    if (status && status !== 'All') {
      filter.status = status;
    }

    const applications = await JobApplication.find(filter).sort({ updatedAt: -1 });

    // Group counts by pipeline stage
    const stages = [
      'Interested', 'Preparing to Apply', 'Applied', 
      'Assessment', 'Interview', 'Offer Received', 'Rejected', 'Withdrawn'
    ];
    const stageCounts = {};
    stages.forEach(s => stageCounts[s] = 0);
    applications.forEach(app => {
      if (stageCounts[app.status] !== undefined) {
        stageCounts[app.status]++;
      }
    });

    res.json({
      success: true,
      count: applications.length,
      stageCounts,
      applications
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/applications
 * Save or track a new application
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const {
      title, company, listingType, listingId, status,
      appliedDate, interviewDate, followUpDate, deadline, notes, officialUrl
    } = req.body;

    if (!title || !company) {
      return res.status(400).json({ success: false, message: 'Position title and company name are required.' });
    }

    const application = await JobApplication.create({
      userId: req.user._id,
      title,
      company,
      listingType: listingType || 'job',
      listingId: listingId || '',
      status: status || 'Interested',
      appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
      interviewDate: interviewDate ? new Date(interviewDate) : undefined,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      notes: notes || '',
      officialUrl: officialUrl || ''
    });

    res.status(201).json({
      success: true,
      message: 'Application tracked successfully.',
      application
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/v1/applications/:id
 * Update status, notes, or dates of an application
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found or unauthorized.' });
    }

    const { status, notes, interviewDate, followUpDate, deadline } = req.body;
    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (interviewDate !== undefined) application.interviewDate = interviewDate ? new Date(interviewDate) : null;
    if (followUpDate !== undefined) application.followUpDate = followUpDate ? new Date(followUpDate) : null;
    if (deadline !== undefined) application.deadline = deadline ? new Date(deadline) : null;

    await application.save();

    res.json({
      success: true,
      message: 'Application updated.',
      application
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/v1/applications/:id
 * Delete a tracked application
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const result = await JobApplication.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    res.json({
      success: true,
      message: 'Application removed from tracker.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
