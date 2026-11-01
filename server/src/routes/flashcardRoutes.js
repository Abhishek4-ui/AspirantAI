const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const { protect, optionalProtect } = require('../middleware/auth');

const STANDARD_CURATED_CARDS = [
  {
    _id: 'card-polity-32',
    subject: 'Indian Polity',
    topic: 'Fundamental Rights',
    front: 'Which Constitutional Article is known as the "Heart and Soul of the Constitution"?',
    back: 'Article 32 (Right to Constitutional Remedies) — as declared by Dr. B.R. Ambedkar.',
    hindiFront: 'संविधान के किस अनुच्छेद को डॉ. बी.आर. अम्बेडकर ने "संविधान का हृदय और आत्मा" कहा था?',
    hindiBack: 'अनुच्छेद 32 (संवैधानिक उपचारों का अधिकार)।',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0
  },
  {
    _id: 'card-quant-speed',
    subject: 'Quantitative Aptitude',
    topic: 'Speed, Time and Distance',
    front: 'Formula for Average Speed when covering two equal distances with speeds x and y?',
    back: 'Average Speed = 2xy / (x + y)',
    hindiFront: 'समान दूरी को चाल x और y से तय करने पर औसत चाल का सूत्र क्या है?',
    hindiBack: 'औसत चाल = 2xy / (x + y)',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0
  },
  {
    _id: 'card-sci-volt',
    subject: 'General Science',
    topic: 'Physics',
    front: 'What is the SI unit of Electric Potential and Potential Difference?',
    back: 'Volt (V), named after Alessandro Volta. 1 Volt = 1 Joule / 1 Coulomb.',
    hindiFront: 'विद्युत विभव (Electric Potential) का SI मात्रक क्या है?',
    hindiBack: 'वोल्ट (Volt - V)। 1 वोल्ट = 1 जूल / 1 कूलॉम।',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0
  },
  {
    _id: 'card-gate-master',
    subject: 'Computer Science',
    topic: 'Algorithms',
    front: 'What is the Master Theorem condition for T(n) = 2T(n/2) + O(n)?',
    back: 'Case 2: a = 2, b = 2, f(n) = O(n^1). Since f(n) = Θ(n^(log_b a)) = Θ(n^1), T(n) = Θ(n log n).',
    hindiFront: 'मास्टर प्रमेय में T(n) = 2T(n/2) + O(n) की समय जटिलता क्या होगी?',
    hindiBack: 'केस 2: T(n) = Θ(n log n)।',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0
  }
];

/**
 * @route GET /api/v1/flashcards
 */
router.get('/', optionalProtect, async (req, res, next) => {
  try {
    const { dueOnly, subject } = req.query;

    if (!req.user) {
      let guestCards = STANDARD_CURATED_CARDS;
      if (subject && subject !== 'All') {
        guestCards = guestCards.filter(c => c.subject.toLowerCase() === subject.toLowerCase());
      }
      return res.json({ success: true, count: guestCards.length, cards: guestCards });
    }

    const query = { userId: req.user._id };

    if (dueOnly === 'true') {
      query.nextReviewDate = { $lte: new Date() };
    }
    if (subject && subject !== 'All') {
      query.subject = subject;
    }

    let cards = await Flashcard.find(query).sort({ nextReviewDate: 1 });

    // Seed default cards if user has none
    if (cards.length === 0 && !subject) {
      const defaultCards = STANDARD_CURATED_CARDS.map(c => ({
        userId: req.user._id,
        subject: c.subject,
        topic: c.topic,
        front: c.front,
        back: c.back,
        hindiFront: c.hindiFront,
        hindiBack: c.hindiBack,
        nextReviewDate: new Date()
      }));
      await Flashcard.insertMany(defaultCards);
      cards = await Flashcard.find({ userId: req.user._id });
    }

    res.json({ success: true, count: cards.length, cards });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/flashcards
 * Create flashcard
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { subject, topic, front, back, hindiFront, hindiBack } = req.body;
    const card = await Flashcard.create({
      userId: req.user._id,
      subject,
      topic,
      front,
      back,
      hindiFront,
      hindiBack,
      nextReviewDate: new Date()
    });
    res.status(201).json({ success: true, card });
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/v1/flashcards/:id/review
 * Spaced Repetition (SM-2 Algorithm)
 * rating: 0 to 5 (0: complete blackout, 3: correct with effort, 5: perfect recall)
 */
router.post('/:id/review', optionalProtect, async (req, res, next) => {
  try {
    const { rating } = req.body; // integer 0-5
    const q = Math.max(0, Math.min(5, Number(rating)));

    let card = null;
    if (req.user) {
      card = await Flashcard.findOne({ _id: req.params.id, userId: req.user._id });
    }

    if (!card) {
      // Find from curated cards or fallback mock card for guest session
      const found = STANDARD_CURATED_CARDS.find(c => c._id === req.params.id);
      card = found ? { ...found } : {
        _id: req.params.id,
        repetitions: 0,
        interval: 1,
        easeFactor: 2.5
      };
    }

    if (q >= 3) {
      if (card.repetitions === 0) {
        card.interval = 1;
      } else if (card.repetitions === 1) {
        card.interval = 6;
      } else {
        card.interval = Math.round(card.interval * card.easeFactor);
      }
      card.repetitions += 1;
    } else {
      card.repetitions = 0;
      card.interval = 1;
    }

    // Update ease factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

    // Schedule next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + card.interval);
    card.nextReviewDate = nextDate;
    card.lastReviewedAt = new Date();

    if (req.user && typeof card.save === 'function') {
      await card.save();
    }
    res.json({ success: true, card, nextReviewDays: card.interval });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
