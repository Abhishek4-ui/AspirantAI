const express = require('express');
const router = express.Router();
const SavedNote = require('../models/SavedNote');
const { protect } = require('../middleware/auth');
const geminiService = require('../services/geminiService');

/**
 * @route GET /api/v1/notes
 * List user's saved notes
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const { search, subject, folder } = req.query;
    const filter = { userId: req.user._id };

    if (subject && subject !== 'All') {
      filter.subject = subject;
    }
    if (folder && folder !== 'All') {
      filter.folder = folder;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await SavedNote.find(filter).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: notes.length,
      notes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/notes/generate
 * Generate structured study notes (Hindi & English supported)
 */
router.post('/generate', protect, async (req, res, next) => {
  try {
    const { topic, subject, examCategory = 'General', difficulty = 'Intermediate', language = 'en', format = 'detailed_summary' } = req.body;

    if (!topic || !subject) {
      return res.status(400).json({ success: false, message: 'Topic and subject are required.' });
    }

    // Call Real Gemini Intelligence Engine for custom generated notes
    const geminiRes = await geminiService.generateComprehensiveNotes({ topic, subject, examCategory });
    let noteContent = geminiRes.content;

    res.json({
      success: true,
      note: {
        title: `${topic} - ${subject}`,
        subject,
        topic,
        examCategory,
        language,
        format,
        content: noteContent,
        isAiGenerated: true
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/notes
 * Save a study note
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, subject, topic, examCategory, language, content, format, tags, folder } = req.body;

    if (!title || !subject || !topic || !content) {
      return res.status(400).json({ success: false, message: 'Title, subject, topic, and content are required.' });
    }

    const note = await SavedNote.create({
      userId: req.user._id,
      title,
      subject,
      topic,
      examCategory: examCategory || 'General',
      language: language || 'en',
      content,
      format: format || 'detailed_summary',
      tags: Array.isArray(tags) ? tags : [],
      folder: folder || 'Default',
      isAiGenerated: true
    });

    res.status(201).json({
      success: true,
      message: 'Note saved successfully.',
      note
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT /api/v1/notes/:id
 * Edit note
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const note = await SavedNote.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    const { title, content, folder, tags } = req.body;
    if (title) note.title = title;
    if (content) note.content = content;
    if (folder) note.folder = folder;
    if (tags) note.tags = tags;

    await note.save();

    res.json({
      success: true,
      message: 'Note updated.',
      note
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route DELETE /api/v1/notes/:id
 * Delete note
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const result = await SavedNote.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    res.json({
      success: true,
      message: 'Note deleted.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
