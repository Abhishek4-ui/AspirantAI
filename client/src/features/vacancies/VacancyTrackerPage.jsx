import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, ExternalLink, Calendar, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function VacancyTrackerPage() {
  const [vacancies, setVacancies] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVacancies();
  }, [category, search]);

  const fetchVacancies = async () => {
    try {
      const res = await api.get(`/vacancies?category=${category}&search=${encodeURIComponent(search)}`);
      if (res.data.success) {
        setVacancies(res.data.vacancies);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> 100% Authoritative & Verified
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Official Vacancy Tracker</h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Central and state government job recruitment notifications cross-verified against official gazettes and portals.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Civil Services', 'State PSC', 'SSC', 'Railway', 'Banking'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                category === cat ? 'bg-electric-blue text-white shadow-glow-blue' : 'bg-navy-900 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts or departments..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading verified notifications...</div>
      ) : vacancies.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-400">
          No notifications found matching your search.
        </div>
      ) : (
        <div className="space-y-4">
          {vacancies.map((v) => (
            <div key={v._id} className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-navy-800 text-neon-cyan border border-slate-700">
                      {v.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Notif: {v.notificationNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{v.post}</h3>
                  <div className="text-xs font-semibold text-slate-300 mt-0.5">{v.organization}</div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-black text-neon-cyan">{v.totalVacancies.toLocaleString()}</div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Vacancies</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-navy-900/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Qualification & Eligibility:</span>
                  <span className="font-semibold text-white">{v.qualification}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Application Window:</span>
                  <span className="font-semibold text-amber-400">
                    {new Date(v.applicationStartDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} – {new Date(v.applicationEndDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Scheduled Exam Date:</span>
                  <span className="font-semibold text-white">{v.examDate}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Source: {v.source}
                </span>

                <div className="flex items-center gap-3">
                  <a
                    href={v.officialNotificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-300 hover:text-white inline-flex items-center gap-1 font-semibold"
                  >
                    View Gazette <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={v.applicationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold hover:brightness-110 shadow-glow-blue inline-flex items-center gap-1"
                  >
                    Apply on Official Portal <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
