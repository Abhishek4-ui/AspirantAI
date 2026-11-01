import React from 'react';
import { Link } from 'react-router-dom';
import appConfig from '../../config/appConfig';
import CreatorCredit from '../CreatorCredit';
import { Sparkles, Shield, Compass, FileText, HelpCircle, Heart, Award, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-navy-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-sm">
              <div className="w-full h-full bg-white dark:bg-navy-900 rounded-[6px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-neon-cyan" />
              </div>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              Aspirant<span className="text-blue-600">AI</span>
            </span>
          </Link>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {appConfig.APP_TAGLINE}
          </p>
          <div className="pt-2">
            <CreatorCredit />
          </div>
        </div>

        {/* All-India Examinations */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Competitive Examinations
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/gate" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors font-medium">GATE 2026/2025 (30 Papers)</Link></li>
            <li><Link to="/exams" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">UPSC Civil Services (IAS/IPS)</Link></li>
            <li><Link to="/exams" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">BPSC 70th/71st CCE</Link></li>
            <li><Link to="/exams" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">SSC CGL, CHSL & MTS</Link></li>
            <li><Link to="/exams" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Banking (IBPS & SBI PO)</Link></li>
            <li><Link to="/exams" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Railway (RRB NTPC & Group D)</Link></li>
          </ul>
        </div>

        {/* Learning Tools & Board Prep */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Assessment & AI Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/daily-quiz" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Daily 100-Question Grand Quiz</Link></li>
            <li><Link to="/cbt-simulator" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">CBT Examination Simulator</Link></li>
            <li><Link to="/coding" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Coding Sandbox & LeetCode</Link></li>
            <li><Link to="/learning-library" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Syllabus Video Library</Link></li>
            <li><Link to="/boards/class-10" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Class 10th Board Hub</Link></li>
            <li><Link to="/boards/class-12" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Class 12th Board Hub</Link></li>
          </ul>
        </div>

        {/* Platform & Verification */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
            Platform & Legal
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/developer" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors font-medium">Developer Profile</Link></li>
            <li><Link to="/about" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">About AspirantAI</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Terms of Service</Link></li>
            <li><Link to="/support" className="hover:text-blue-600 dark:hover:text-neon-cyan transition-colors">Help & Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>{appConfig.FOOTER_COPYRIGHT}</div>
        <div className="flex items-center gap-1 text-slate-500">
          <span>Engineered with passion for Indian student excellence</span>
        </div>
      </div>
    </footer>
  );
}
