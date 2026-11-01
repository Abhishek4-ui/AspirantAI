const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @route POST /api/v1/onboarding/preferences
 * Complete initial exam selection & preferences
 */
router.post('/preferences', protect, async (req, res, next) => {
  try {
    const {
      primaryExamId,
      preparationGoals,
      educationProfile,
      studyPreferences,
      preferredLanguage
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (primaryExamId) user.primaryExamId = primaryExamId;
    if (Array.isArray(preparationGoals)) user.preparationGoals = preparationGoals;
    if (educationProfile) user.educationProfile = { ...user.educationProfile, ...educationProfile };
    if (studyPreferences) user.studyPreferences = { ...user.studyPreferences, ...studyPreferences };
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;

    user.onboardingCompleted = true;
    await user.save();

    res.json({
      success: true,
      message: 'Onboarding preferences successfully saved.',
      user: {
        id: user._id,
        name: user.name,
        onboardingCompleted: user.onboardingCompleted,
        primaryExamId: user.primaryExamId,
        preparationGoals: user.preparationGoals,
        educationProfile: user.educationProfile,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/onboarding/options
 * Returns supported exam categories & board streams
 */
router.get('/options', async (req, res) => {
  const competitiveCategories = [
    { id: 'civil_services', name: 'Civil Services', exams: ['UPSC CSE', 'BPSC 70th/71st CCE', 'UPPSC PCS', 'MPPSC'] },
    { id: 'ssc', name: 'SSC Recruitment', exams: ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC CPO', 'SSC GD'] },
    { id: 'banking', name: 'Banking & Insurance', exams: ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RRB Scale I/Office Assistant'] },
    { id: 'railway', name: 'Railway Recruitment', exams: ['RRB NTPC', 'RRB Group D', 'RRB ALP', 'RRB JE'] },
    { id: 'defence', name: 'Defence Services', exams: ['NDA', 'CDS', 'AFCAT', 'CAPF AC', 'Agniveer'] },
    { id: 'teaching', name: 'Teaching Eligibility', exams: ['CTET Paper 1 & 2', 'Bihar STET', 'UPTET', 'KVS / NVS'] },
    { id: 'police', name: 'State Police & SI', exams: ['Bihar Police Constable & SI', 'UP Police SI/Constable', 'Delhi Police'] },
    { id: 'technical', name: 'Technical & Engineering', exams: ['GATE', 'ISRO Scientist/Engineer', 'DRDO CEPTAM'] }
  ];

  const boardOptions = [
    { id: 'class_10', title: 'Class 10th Board Exam', boards: ['CBSE', 'Bihar School Examination Board (BSEB)', 'ICSE', 'UP Board'] },
    {
      id: 'class_12',
      title: 'Class 12th Board Exam',
      boards: ['CBSE', 'Bihar School Examination Board (BSEB)', 'ISC', 'UP Board'],
      streams: ['Science (PCM)', 'Science (PCB)', 'Science (PCMB)', 'Commerce', 'Arts / Humanities']
    }
  ];

  res.json({
    success: true,
    competitiveCategories,
    boardOptions
  });
});

module.exports = router;
