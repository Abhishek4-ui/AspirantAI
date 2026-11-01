import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Layers, RotateCcw, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';

export default function FlashcardsPage() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await api.get('/flashcards');
      if (res.data.success) {
        setCards(res.data.cards);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRating = async (rating) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    try {
      await api.post(`/flashcards/${currentCard._id}/review`, { rating });
      setIsFlipped(false);
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(c => c + 1);
      } else {
        fetchCards();
        setCurrentIndex(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading spaced repetition cards...</div>;

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-neon-cyan text-xs font-bold mb-3 shadow-sm">
          <Layers className="w-3.5 h-3.5" /> SuperMemo SM-2 Algorithm
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Spaced Repetition Flashcards</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
          High-yield constitutional articles, mathematical formulas, and scientific definitions scheduled scientifically for long-term retention.
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm">
          No cards due for review right now. All caught up!
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="text-blue-600 dark:text-neon-cyan font-bold">{currentCard?.subject} • {currentCard?.topic}</span>
          </div>

          {/* 3D Flip Card */}
          <motion.div
            onClick={() => setIsFlipped(!isFlipped)}
            whileHover={{ scale: 1.01 }}
            className="w-full min-h-[300px] bg-white dark:bg-navy-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-electric-blue/30 cursor-pointer flex flex-col items-center justify-center text-center shadow-md dark:shadow-2xl relative select-none"
          >
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 absolute top-4 left-6">
              {isFlipped ? 'Answer / Solution (Click to Flip Back)' : 'Question / Formula (Click to Reveal)'}
            </span>

            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white max-w-xl leading-relaxed my-auto">
              {isFlipped ? currentCard?.back : currentCard?.front}
            </div>

            {isFlipped && currentCard?.hindiBack && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 border-t border-slate-200 dark:border-slate-800 pt-3">
                {currentCard.hindiBack}
              </p>
            )}
          </motion.div>

          {/* SM-2 Recall Ratings (0 to 5) */}
          {isFlipped ? (
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-4 text-center space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">How easily did you recall this card?</span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleReviewRating(1)}
                  className="py-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/40 text-red-700 dark:text-red-300 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900"
                >
                  Hard (1d)
                </button>
                <button
                  onClick={() => handleReviewRating(3)}
                  className="py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900"
                >
                  Good (3d)
                </button>
                <button
                  onClick={() => handleReviewRating(4)}
                  className="py-2.5 rounded-xl bg-blue-50 dark:bg-electric-blue/20 border border-blue-200 dark:border-electric-blue/40 text-blue-700 dark:text-electric-glow text-xs font-bold hover:bg-blue-100 dark:hover:bg-electric-blue/30"
                >
                  Easy (6d)
                </button>
                <button
                  onClick={() => handleReviewRating(5)}
                  className="py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900"
                >
                  Mastered (14d)
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setIsFlipped(true)}
                className="px-6 py-2.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-blue-600 dark:text-neon-cyan hover:border-blue-400"
              >
                Tap card to reveal answer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
