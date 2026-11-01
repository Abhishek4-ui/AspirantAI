const express = require('express');
const router = express.Router();
const Board = require('../models/Board');

/**
 * @route GET /api/v1/boards
 */
router.get('/', async (req, res, next) => {
  try {
    const boards = await Board.find();
    res.json({ success: true, count: boards.length, boards });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/v1/boards/:boardCode/:classLevel
 */
router.get('/:boardCode/:classLevel', async (req, res, next) => {
  try {
    const { boardCode, classLevel } = req.params;
    const board = await Board.findOne({ code: boardCode.toUpperCase() });

    if (!board) {
      return res.status(404).json({ success: false, message: 'Board not found.' });
    }

    const classData = board.classes.find(c => c.classLevel === classLevel);
    if (!classData) {
      return res.status(404).json({ success: false, message: `Class ${classLevel} not found for board ${boardCode}.` });
    }

    res.json({
      success: true,
      boardName: board.name,
      state: board.state,
      classLevel,
      streams: classData.streams
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
