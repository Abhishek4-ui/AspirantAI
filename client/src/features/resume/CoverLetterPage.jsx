import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FileText, Sparkles, Copy, CheckCircle2, Send, ArrowRight, Building, Briefcase } from 'lucide-react';

export default function CoverLetterPage() {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('Full Stack Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [customHighlights, setCustomHighlights] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !jobTitle.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/resumes/cover-letter', {
        companyName,
        jobTitle,
        jobDescription,
        customHighlights
      });

      if (res.data.success) {
        setCoverLetter(res.data.coverLetter);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
          <Sparkles className="w-3.5 h-3.5" /> ATS-Optimized Career Suite
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Targeted Cover Letter Generator</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Generate high-impact, role-specific cover letters tailored to exact job descriptions and engineering requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Building className="w-4 h-4 text-neon-cyan" /> Application Parameters
          </h2>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Google / Atlassian / InnovateTech"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-xs bg-navy-950 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Position / Job Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Software Development Engineer Intern"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-xs bg-navy-950 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Job Description or Key Requirements (Optional)</label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste key responsibilities or required technologies from the job posting..."
                className="w-full p-3 rounded-xl glass-input text-white text-xs bg-navy-950 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Custom Highlights to Emphasize (Optional)</label>
              <input
                type="text"
                value={customHighlights}
                onChange={(e) => setCustomHighlights(e.target.value)}
                placeholder="e.g. MERN stack projects, 300+ LeetCode problems solved"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-white text-xs bg-navy-950 placeholder-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-blue via-neon-cyan to-neon-purple text-white font-extrabold text-xs shadow-glow-blue hover:brightness-110 flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Synthesizing Cover Letter...' : 'Generate Professional Cover Letter'}</span>
            </button>
          </form>
        </div>

        {/* Output Panel */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-neon-cyan" /> Generated Cover Letter
            </h2>
            {coverLetter && (
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg glass-panel text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            )}
          </div>

          <div className="flex-1 min-h-[300px]">
            {coverLetter ? (
              <textarea
                rows={16}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full h-full p-4 rounded-2xl glass-input text-xs sm:text-sm text-slate-200 bg-navy-950 font-serif leading-relaxed"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-xs text-slate-500 space-y-2">
                <FileText className="w-10 h-10 text-slate-600 mb-2" />
                <p>Fill out the company and role details on the left to generate your custom cover letter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
