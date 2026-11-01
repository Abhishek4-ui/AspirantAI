import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { translations } from '../../i18n/translations';
import {
  Menu, X, Sparkles, BookOpen, Award, Zap, Code, Briefcase,
  Compass, Users, Bell, User, LogOut, ChevronDown, Layers, Calendar,
  FolderGit2, Database, FileText, Sun, Moon, Monitor
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout, language, toggleLanguage } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [techDropdownOpen, setTechDropdownOpen] = useState(false);
  const [careerDropdownOpen, setCareerDropdownOpen] = useState(false);
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const [examsDropdownOpen, setExamsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const techLinks = [
    { name: 'Coding Sandbox (Monaco)', path: '/coding', icon: Code },
    { name: 'AI Coding Assistant & Debugger', path: '/coding/assistant', icon: Sparkles },
    { name: 'SQL Practice Workspace', path: '/sql-workspace', icon: Database },
    { name: 'Structured Roadmaps (DSA/Web/AI)', path: '/roadmaps', icon: Compass },
    { name: 'Project Lab & GitHub Showcase', path: '/projects', icon: FolderGit2 },
    { name: 'Video Masterclasses', path: '/learning-library', icon: BookOpen }
  ];

  const careerLinks = [
    { name: 'Dedicated Internship Portal', path: '/internships', icon: Briefcase },
    { name: 'Fresher & Entry-Level Jobs', path: '/jobs', icon: Award },
    { name: 'AI Interview Practice Simulator', path: '/interview-prep', icon: Sparkles },
    { name: 'Application Pipeline Tracker', path: '/applications', icon: Layers },
    { name: 'Resume Builder & AI Reviewer', path: '/resume-builder', icon: FileText },
    { name: 'Targeted Cover Letter Generator', path: '/cover-letter', icon: FileText }
  ];

  const examLinks = [
    { name: 'GATE All-Branch Hub (30 Papers)', path: '/gate', icon: Compass },
    { name: 'All-India Exam Directory', path: '/exams', icon: BookOpen },
    { name: 'Full Mock Test Series', path: '/mock-tests', icon: Award },
    { name: 'CBT Examination Simulator', path: '/cbt-simulator', icon: Layers },
    { name: 'Verified PYQ Library', path: '/pyq', icon: BookOpen },
    { name: 'Daily 100-Question Grand Quiz', path: '/daily-quiz', icon: Zap },
    { name: 'Live Multi-User Quiz Battles', path: '/live-quiz', icon: Award },
    { name: 'Unified Exam & Dates Calendar', path: '/calendar', icon: Calendar },
    { name: 'Government Vacancy Tracker', path: '/vacancies', icon: Bell }
  ];

  const aiTools = [
    { name: 'AI Study Notes Generator', path: '/ai-notes', icon: FileText },
    { name: 'AI Doubt Solver', path: '/ai-tutor/doubts', icon: Sparkles },
    { name: 'Personalized AI Study Coach', path: '/ai-tutor/coach', icon: Zap },
    { name: 'Spaced Flashcards (SM-2)', path: '/flashcards', icon: BookOpen },
    { name: 'AI Mistake Notebook', path: '/mistake-notebook', icon: BookOpen },
    { name: 'Smart Study Planner', path: '/study-planner', icon: Calendar }
  ];

  const closeDropdowns = () => {
    setTechDropdownOpen(false);
    setCareerDropdownOpen(false);
    setAiDropdownOpen(false);
    setExamsDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-navy-950/85 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" onClick={closeDropdowns} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                Aspirant<span className="text-blue-600">AI</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold tracking-widest text-slate-500 uppercase">
                All-India Exam Prep & Career Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-sm font-medium">
            
            {/* Exams Dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeDropdowns(); setExamsDropdownOpen(!examsDropdownOpen); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Exams & Tests</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {examsDropdownOpen && (
                <div
                  onMouseLeave={() => setExamsDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1"
                >
                  {examLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeDropdowns}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-600/20 hover:text-blue-600 dark:hover:text-blue-300 transition"
                      >
                        <Icon className="w-4 h-4 text-blue-500" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coding & Tech Dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeDropdowns(); setTechDropdownOpen(!techDropdownOpen); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <Code className="w-3.5 h-3.5 text-cyan-500" />
                <span>Coding & Tech</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {techDropdownOpen && (
                <div
                  onMouseLeave={() => setTechDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1"
                >
                  {techLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeDropdowns}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-cyan-50 dark:hover:bg-blue-600/20 hover:text-cyan-700 dark:hover:text-cyan-300 transition"
                      >
                        <Icon className="w-4 h-4 text-cyan-500" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Careers Dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeDropdowns(); setCareerDropdownOpen(!careerDropdownOpen); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <Briefcase className="w-3.5 h-3.5 text-purple-500" />
                <span>Careers & Jobs</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {careerDropdownOpen && (
                <div
                  onMouseLeave={() => setCareerDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1"
                >
                  {careerLinks.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeDropdowns}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-purple-600/20 hover:text-purple-700 dark:hover:text-purple-300 transition"
                      >
                        <Icon className="w-4 h-4 text-purple-500" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => { closeDropdowns(); setAiDropdownOpen(!aiDropdownOpen); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Suite</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {aiDropdownOpen && (
                <div
                  onMouseLeave={() => setAiDropdownOpen(false)}
                  className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 space-y-1"
                >
                  {aiTools.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeDropdowns}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-purple-600/20 hover:text-amber-700 dark:hover:text-purple-300 transition"
                      >
                        <Icon className="w-4 h-4 text-amber-500" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/gate"
              onClick={closeDropdowns}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-blue-600 dark:text-neon-cyan" />
              <span>GATE Portal</span>
            </Link>

            <Link
              to="/community"
              onClick={closeDropdowns}
              className="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
            >
              Community
            </Link>
          </div>

          {/* Right Action Menu: Theme, Language & Auth */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Selector (Dark, Light, System) */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-0.5" role="group" aria-label="Theme mode">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition ${theme === 'light' ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                title="Light Mode"
                aria-label="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition ${theme === 'dark' ? 'bg-blue-600 text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                title="Dark Mode"
                aria-label="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg transition ${theme === 'system' ? 'bg-slate-200 dark:bg-blue-600 text-slate-800 dark:text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                title="System Mode"
                aria-label="System Mode"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => toggleLanguage()}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-slate-400 transition"
            >
              {language === 'en' ? 'हिन्दी' : 'English'}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{user?.name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-600 dark:text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-500/10 dark:bg-slate-800 dark:hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-xs font-extrabold shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title={resolvedTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              onClick={() => toggleLanguage()}
              className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 p-5 space-y-4 bg-white/95 dark:bg-navy-950/95 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Exams & Tests</div>
            {examLinks.map(e => (
              <Link
                key={e.path}
                to={e.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {e.name}
              </Link>
            ))}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Coding & Tech</div>
            {techLinks.map(t => (
              <Link
                key={t.path}
                to={t.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {t.name}
              </Link>
            ))}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Careers & Jobs</div>
            {careerLinks.map(c => (
              <Link
                key={c.path}
                to={c.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="w-full py-2.5 rounded-xl text-center text-xs font-bold text-red-500 bg-red-500/10"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
