import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CreatorCredit from '../../components/CreatorCredit';
import { User, Mail, Phone, Award, Shield, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ProfileSettingsPage() {
  const { user, toggleLanguage, language } = useAuth();
  const [success, setSuccess] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSuccess('Preferences updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Profile & Preferences</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your exam goals, language, and account security</p>
      </div>

      <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-electric-blue to-neon-purple p-0.5 shadow-glow-blue flex-shrink-0">
            <div className="w-full h-full bg-navy-900 rounded-[14px] flex items-center justify-center text-xl font-bold text-white">
              {user?.name?.charAt(0) || 'A'}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <div className="text-xs text-slate-400">{user?.email} • {user?.mobile}</div>
            <div className="mt-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40">
                Role: {user?.role || 'student'}
              </span>
            </div>
          </div>
        </div>

        {success && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Exam Goal</label>
              <input
                type="text"
                disabled
                value={user?.primaryExamId || 'UPSC_CSE'}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-slate-300 bg-navy-900 cursor-not-allowed"
              />
              <Link to="/onboarding" className="text-[11px] text-neon-cyan hover:underline mt-1 inline-block">
                Edit or Change Exam Goals →
              </Link>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => toggleLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white bg-navy-900"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <Link
              to="/data-export"
              className="text-xs text-slate-300 hover:text-neon-cyan inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Export My Learning Data
            </Link>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
