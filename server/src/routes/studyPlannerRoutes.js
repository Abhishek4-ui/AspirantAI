const express = require('express');
const router = express.Router();
const StudyPlan = require('../models/StudyPlan');
const { protect, optionalProtect } = require('../middleware/auth');

/**
 * @route GET /api/v1/study-planner
 */
router.get('/', optionalProtect, async (req, res, next) => {
  try {
    if (!req.user) {
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 4);
      return res.json({
        success: true,
        plan: {
          targetExam: 'All-India Competitive Exam',
          targetExamDate: targetDate,
          availableDailyHours: 4,
          dailyTasks: [
            { id: 'task-1', title: 'Complete Daily All-India AI Quiz', subject: 'General Knowledge', durationMinutes: 60, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] },
            { id: 'task-2', title: 'Revise 20 Spaced Repetition Flashcards', subject: 'Polity & Formulas', durationMinutes: 30, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] },
            { id: 'task-3', title: 'Solve 25 Practice MCQs', subject: 'Mathematics / CS', durationMinutes: 45, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] },
            { id: 'task-4', title: 'Review Mistakes in AI Mistake Notebook', subject: 'Revision', durationMinutes: 30, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] }
          ],
          weeklyMilestones: [
            { weekNumber: 1, title: 'Indian Constitution & Fundamentals', targetChapters: ['Preamble', 'Fundamental Rights'], isAchieved: true },
            { weekNumber: 2, title: 'Quantitative Arithmetic Mastery', targetChapters: ['Percentages', 'Ratio & Proportion'], isAchieved: false },
            { weekNumber: 3, title: 'Modern History & National Movement', targetChapters: ['1857 Revolt', 'Gandhi Era'], isAchieved: false }
          ],
          syllabusCompletionPercentage: 42
        }
      });
    }

    let plan = await StudyPlan.findOne({ userId: req.user._id });

    if (!plan) {
      // Create intelligent default study plan for user
      const targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 4);

      plan = await StudyPlan.create({
        userId: req.user._id,
        targetExam: req.user.primaryExamId || 'All-India Competitive Exam',
        targetExamDate: targetDate,
        availableDailyHours: req.user.studyPreferences?.targetHoursPerDay || 4,
        dailyTasks: [
          { id: 'task-1', title: 'Complete Daily 100-Question All-India AI Quiz', subject: 'General Knowledge', durationMinutes: 60, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] },
          { id: 'task-2', title: 'Revise 20 Spaced Repetition Flashcards', subject: 'Polity & Formulas', durationMinutes: 30, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] },
          { id: 'task-3', title: 'Solve 25 Quantitative Aptitude Practice MCQs', subject: 'Mathematics', durationMinutes: 45, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] },
          { id: 'task-4', title: 'Review Mistakes in AI Mistake Notebook', subject: 'Revision', durationMinutes: 30, isCompleted: false, scheduledDate: new Date().toISOString().split('T')[0] }
        ],
        weeklyMilestones: [
          { weekNumber: 1, title: 'Indian Constitution & Fundamentals', targetChapters: ['Preamble', 'Fundamental Rights'], isAchieved: true },
          { weekNumber: 2, title: 'Quantitative Arithmetic Mastery', targetChapters: ['Percentages', 'Ratio & Proportion'], isAchieved: false },
          { weekNumber: 3, title: 'Modern History & National Movement', targetChapters: ['1857 Revolt', 'Gandhi Era'], isAchieved: false }
        ],
        syllabusCompletionPercentage: 42
      });
    }

    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/study-planner/task/toggle
 */
router.post('/task/toggle', protect, async (req, res, next) => {
  try {
    const { taskId } = req.body;
    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });

    const task = plan.dailyTasks.find(t => t.id === taskId);
    if (task) {
      task.isCompleted = !task.isCompleted;
      await plan.save();
    }

    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/study-planner/task/add
 */
router.post('/task/add', protect, async (req, res, next) => {
  try {
    const { title, subject, durationMinutes } = req.body;
    const plan = await StudyPlan.findOne({ userId: req.user._id });
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });

    plan.dailyTasks.push({
      id: `task-${Date.now()}`,
      title,
      subject: subject || 'General',
      durationMinutes: durationMinutes || 30,
      isCompleted: false,
      scheduledDate: new Date().toISOString().split('T')[0]
    });

    await plan.save();
    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
