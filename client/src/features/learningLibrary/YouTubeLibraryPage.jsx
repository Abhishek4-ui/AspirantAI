import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Video, Play, Search, Filter, Bookmark, ExternalLink,
  BookOpen, CheckCircle, Clock, Sparkles, Layers,
  ChevronRight, Award, Compass, Check, BookmarkCheck,
  Maximize2, Share2, AlertCircle, RefreshCw, ListVideo
} from 'lucide-react';

const EXAM_CATEGORIES = [
  'All',
  'Civil Services',
  'State PSC',
  'SSC',
  'Banking',
  'Railway',
  'GATE CSE',
  'JEE',
  'NEET',
  'Class 10',
  'Coding & DSA'
];

const SYLLABUS_QUICK_TOPICS = {
  'Civil Services': ['Fundamental Rights', 'Directive Principles', 'Modern History 1857', 'Physical Geography', 'Indian Economy Basics'],
  'State PSC': ['Bihar Special History', 'BPSC General Science', 'State Administration', 'Geography of Bihar', 'Current Affairs'],
  'SSC': ['Arithmetic Time & Work', 'Trigonometry & Geometry', 'Syllogism', 'Blood Relations', 'English Grammar Cloze Test'],
  'Banking': ['Seating Arrangement Puzzles', 'Data Interpretation Graphs', 'Number Series', 'Banking Awareness', 'Reading Comprehension'],
  'Railway': ['Newton Laws & Motion', 'Periodic Table Elements', 'Human Physiology', 'Speed Time Distance', 'Coding Decoding'],
  'GATE CSE': ['Theory of Computation DFA', 'Operating System CPU Scheduling', 'Compiler Design Parsing', 'Computer Networks TCP/IP', 'Binary Search Trees'],
  'JEE': ['Rotational Dynamics', 'Thermodynamics Physics', 'Organic Reaction Mechanisms', 'Integration Calculus', 'Vectors & 3D'],
  'NEET': ['Genetics & Inheritance', 'Human Circulatory System', 'Plant Physiology', 'Chemical Bonding', 'Optics & Wave Motion'],
  'Class 10': ['Light Reflection & Refraction', 'Chemical Reactions & Equations', 'Real Numbers Math', 'Life Processes Biology', 'Trigonometry Class 10'],
  'Coding & DSA': ['Two Sum & Hash Maps', 'Binary Tree Level Order', 'Dynamic Programming Memoization', 'Graph BFS DFS', 'Linked List Cycle']
};

export default function YouTubeLibraryPage() {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(user?.primaryExamId ? (user.primaryExamId.includes('GATE') ? 'GATE CSE' : user.primaryExamId.includes('BPSC') ? 'State PSC' : 'Civil Services') : 'All');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [contentType, setContentType] = useState('video'); // 'video' | 'playlist'
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [completedIds, setCompletedIds] = useState(new Set());
  const [learningStats, setLearningStats] = useState({ totalCompleted: 0, totalBookmarked: 0 });
  const [searching, setSearching] = useState(false);
  const [quotaNotice, setQuotaNotice] = useState('');
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    fetchInitialVideos();
    if (user) {
      fetchUserProgress();
    }
  }, [selectedCategory, contentType]);

  const fetchInitialVideos = async () => {
    try {
      setLoading(true);
      const res = await api.get('/youtube/curated', {
        params: { examCategory: selectedCategory }
      });
      if (res.data.success && res.data.items?.length > 0) {
        setVideos(res.data.items);
        if (!activeVideo) {
          setActiveVideo(res.data.items[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load curated videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const res = await api.get('/youtube/progress');
      if (res.data.success && res.data.progress) {
        const p = res.data.progress;
        setLearningStats({
          totalCompleted: p.totalCompleted || 0,
          totalBookmarked: p.totalBookmarked || 0
        });
        setBookmarkedIds(new Set((p.bookmarkedList || []).map(b => b.videoId)));
        setCompletedIds(new Set((p.completedList || []).map(c => c.videoId)));
      }
    } catch (err) {
      // Quiet fail if guest
    }
  };

  const handleSearch = async (queryText = search) => {
    const q = (queryText || '').trim();
    if (!q && selectedCategory === 'All') {
      fetchInitialVideos();
      return;
    }

    try {
      setSearching(true);
      setQuotaNotice('');
      const res = await api.get('/youtube/search', {
        params: {
          q,
          examCategory: selectedCategory,
          type: contentType,
          language: selectedLanguage !== 'all' ? selectedLanguage : undefined,
          maxResults: 16
        }
      });

      if (res.data.success && res.data.items?.length > 0) {
        setVideos(res.data.items);
        setActiveVideo(res.data.items[0]);
        if (res.data.quotaWarning) {
          setQuotaNotice(res.data.message);
        }
      } else {
        setVideos([]);
      }
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleTopicClick = (topicName) => {
    setSearch(topicName);
    handleSearch(topicName);
  };

  const handleToggleBookmark = async (video) => {
    const vId = video.videoId || video.id;
    if (!vId) return;

    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(vId)) next.delete(vId);
      else next.add(vId);
      return next;
    });

    if (!user) {
      showToast('Login to sync bookmarks to your profile');
      return;
    }

    try {
      const res = await api.post('/youtube/bookmark', {
        videoId: vId,
        title: video.title,
        channel: video.channel,
        thumbnail: video.thumbnail,
        category: video.category,
        subject: video.subject,
        topic: video.topic
      });
      showToast(res.data.message || 'Bookmark updated');
      fetchUserProgress();
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  const handleMarkCompleted = async (video) => {
    const vId = video.videoId || video.id;
    if (!vId) return;

    setCompletedIds(prev => new Set(prev).add(vId));

    if (!user) {
      showToast('Lesson marked as completed! (+15 XP on login)');
      return;
    }

    try {
      const res = await api.post('/youtube/complete', {
        videoId: vId,
        title: video.title,
        channel: video.channel,
        thumbnail: video.thumbnail,
        category: video.category,
        subject: video.subject,
        topic: video.topic
      });
      showToast(res.data.message || 'Lesson completed! +15 XP awarded');
      fetchUserProgress();
    } catch (err) {
      console.error('Completion error:', err);
    }
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const activeVideoId = activeVideo?.videoId || activeVideo?.id;
  const isCurrentBookmarked = bookmarkedIds.has(activeVideoId);
  const isCurrentCompleted = completedIds.has(activeVideoId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Banner */}
      <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold">
              <Video className="w-3.5 h-3.5" />
              <span>Official YouTube Data API v3 Integrated Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              All-India Examination Video Learning Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Curated masterclasses, syllabus topic playlists, previous-year question walkthroughs, and live YouTube search for UPSC, BPSC, SSC, GATE, Banking, Railways, JEE, NEET & Coding.
            </p>
          </div>

          {/* Quick Learning Stats */}
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-center min-w-[90px]">
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">{learningStats.totalCompleted}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Completed</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-center min-w-[90px]">
              <div className="text-lg font-black text-electric-blue dark:text-neon-cyan">{learningStats.totalBookmarked}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Bookmarked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quota Notice Banner if applicable */}
      {quotaNotice && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{quotaNotice}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search lectures, topics, faculty, PYQ solutions, or courses..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={searching}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-blue transition disabled:opacity-50"
          >
            {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Search YouTube</span>
          </button>
        </div>

        {/* Exam Categories Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EXAM_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearch('');
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-electric-blue text-white shadow-glow-blue'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters: Language & Type */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Quick Syllabus Topics */}
          {selectedCategory !== 'All' && SYLLABUS_QUICK_TOPICS[selectedCategory] && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-electric-blue dark:text-neon-cyan" /> Syllabus Topics:
              </span>
              {SYLLABUS_QUICK_TOPICS[selectedCategory].map((top) => (
                <button
                  key={top}
                  onClick={() => handleTopicClick(top)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-electric-blue dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  {top}
                </button>
              ))}
            </div>
          )}

          {/* Language & Type Controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Language Toggle */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">🌐 Any Language</option>
              <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
              <option value="en">🇬🇧 English</option>
            </select>

            {/* Video vs Playlist */}
            <div className="p-0.5 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-slate-800 flex items-center">
              <button
                onClick={() => setContentType('video')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  contentType === 'video' ? 'bg-electric-blue text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setContentType('playlist')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  contentType === 'playlist' ? 'bg-electric-blue text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Playlists
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Theater Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Active Video Player & Metadata */}
        <div className="lg:col-span-7 space-y-5">
          {activeVideo ? (
            <div className="space-y-4">
              {/* 16:9 Video Embed Player */}
              <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-xl relative group">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${activeVideo.videoId || activeVideo.id}?autoplay=0&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info Card */}
              <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="px-3 py-1 rounded-full bg-electric-blue/10 dark:bg-electric-blue/15 text-electric-blue dark:text-neon-cyan border border-electric-blue/20 dark:border-electric-blue/30 text-xs font-bold">
                    {activeVideo.category || 'General Preparation'} • {activeVideo.subject || 'Lecture'}
                  </span>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBookmark(activeVideo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        isCurrentBookmarked
                          ? 'bg-electric-blue/15 text-electric-blue dark:text-neon-cyan border-electric-blue/30'
                          : 'bg-slate-50 dark:bg-navy-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {isCurrentBookmarked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{isCurrentBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                    </button>

                    <button
                      onClick={() => handleMarkCompleted(activeVideo)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                        isCurrentCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/40'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{isCurrentCompleted ? 'Completed' : 'Mark Completed (+15 XP)'}</span>
                    </button>

                    <a
                      href={activeVideo.url || `https://www.youtube.com/watch?v=${activeVideo.videoId || activeVideo.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      title="Open on YouTube"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {activeVideo.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Channel: <strong className="text-slate-800 dark:text-slate-200">{activeVideo.channel}</strong>
                    {activeVideo.duration && ` • Duration: ${activeVideo.duration}`}
                  </p>
                </div>

                {activeVideo.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-navy-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80">
                    {activeVideo.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-3xl bg-slate-100 dark:bg-navy-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs text-slate-500">
              Select a lecture from the list to begin streaming.
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Playlist / Search Results Library */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-electric-blue dark:text-neon-cyan" />
              <span>Available Learning Resources ({videos.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {contentType === 'playlist' ? 'Complete Playlists' : 'Topic Lectures'}
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 dark:text-slate-400">Loading syllabus-aligned video resources...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No video resources found for this search.</p>
              <button
                onClick={() => { setSearch(''); fetchInitialVideos(); }}
                className="px-4 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1 scrollbar-thin">
              {videos.map((vid) => {
                const vidId = vid.videoId || vid.id;
                const isActive = (activeVideo?.videoId || activeVideo?.id) === vidId;
                const isBookmarked = bookmarkedIds.has(vidId);
                const isCompleted = completedIds.has(vidId);

                return (
                  <div
                    key={vidId}
                    onClick={() => setActiveVideo(vid)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3.5 group ${
                      isActive
                        ? 'bg-blue-50 dark:bg-electric-blue/15 border-blue-500 dark:border-neon-cyan shadow-sm dark:shadow-glow-cyan'
                        : 'bg-white dark:bg-navy-900/60 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-navy-850 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-28 h-18 sm:w-32 sm:h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play className="w-6 h-6 text-white drop-shadow" />
                      </div>
                      {isCompleted && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-white text-[9px] font-black flex items-center gap-0.5">
                          ✓ Done
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-electric-blue dark:group-hover:text-neon-cyan transition">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {vid.channel}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                        <span className="truncate max-w-[130px] text-slate-500 dark:text-slate-400">{vid.category || 'Lecture'}</span>
                        {isBookmarked && (
                          <span className="text-electric-blue dark:text-neon-cyan font-bold flex items-center gap-0.5">
                            ★ Saved
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
