import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  Compass, CheckCircle2, Search, BookOpen,
  Sparkles, Award, ArrowRight, ShieldCheck, GraduationCap
} from 'lucide-react';

export default function OnboardingPage() {
  const { updatePreferences, user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('competitive'); // 'competitive' or 'boards'
  const [search, setSearch] = useState('');
  const [primaryExam, setPrimaryExam] = useState(user?.primaryExamId || 'UPSC_CSE');
  const [additionalGoals, setAdditionalGoals] = useState(user?.preparationGoals || []);
  const [boardConfig, setBoardConfig] = useState({
    board: 'CBSE',
    classLevel: '12',
    stream: 'Science PCM',
    session: '2025-2026'
  });
  const [targetHours, setTargetHours] = useState(4);
  const [loading, setLoading] = useState(false);

  const competitiveList = [
    { id: 'UPSC_CSE', name: 'UPSC Civil Services (IAS/IPS)', category: 'Civil Services', icon: '🏛️' },
    { id: 'BPSC_CCE', name: 'BPSC 70th/71st Combined Exam', category: 'State PSC', icon: '📜' },
    { id: 'UPPSC_PCS', name: 'UPPSC Combined State Exam', category: 'State PSC', icon: '🏛️' },
    { id: 'SSC_CGL', name: 'SSC Combined Graduate Level', category: 'SSC', icon: '⚖️' },
    { id: 'SSC_CHSL', name: 'SSC CHSL 10+2 Examination', category: 'SSC', icon: '📝' },
    { id: 'IBPS_PO', name: 'IBPS Probationary Officer (PO)', category: 'Banking', icon: '🏦' },
    { id: 'SBI_PO', name: 'SBI Probationary Officer', category: 'Banking', icon: '💳' },
    { id: 'RRB_NTPC', name: 'Railway RRB NTPC Non-Technical', category: 'Railway', icon: '🚆' },
    { id: 'RRB_GROUP_D', name: 'Railway Group D Recruitment', category: 'Railway', icon: '🛤️' },
    { id: 'NDA', name: 'National Defence Academy (NDA)', category: 'Defence', icon: '⚔️' },
    { id: 'CDS', name: 'Combined Defence Services (CDS)', category: 'Defence', icon: '🛡️' },
    { id: 'CTET', name: 'Central Teacher Eligibility (CTET)', category: 'Teaching', icon: '👩‍🏫' },
    { id: 'BIHAR_POLICE', name: 'Bihar Police SI & Constable', category: 'Police', icon: '👮' },
    { id: 'GATE', name: 'GATE Technical Engineering', category: 'Technical', icon: '🔬' }
  ];

  const handleToggleGoal = (id) => {
    if (primaryExam === id) return;
    if (additionalGoals.includes(id)) {
      setAdditionalGoals(additionalGoals.filter(g => g !== id));
    } else {
      setAdditionalGoals([...additionalGoals, id]);
    }
  };

  const handleSelectPrimary = (id) => {
    setPrimaryExam(id);
    if (additionalGoals.includes(id)) {
      setAdditionalGoals(additionalGoals.filter(g => g !== id));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updatePreferences({
        primaryExamId: primaryExam,
        preparationGoals: [primaryExam, ...additionalGoals],
        educationProfile: activeTab === 'boards' ? boardConfig : { classLevel: 'graduate' },
        studyPreferences: {
          targetHoursPerDay: targetHours,
          dailyQuizNotification: true
        }
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to save onboarding preferences', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExams = competitiveList.filter(
    e => e.name.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6 sm:p-10 border border-electric-blue/30 shadow-2xl relative"
      >
        {/* Prominent Header from Master Prompt */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric-blue/15 border border-electric-blue/30 text-neon-cyan text-xs font-bold mb-3 shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5" /> Step 4 of 4: Goal Personalization
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Aap kis exam ki preparation kar rahe hain?
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Choose your preparation goal so AspirantAI can personalize your learning dashboard.
          </p>
        </div>

        {/* Tab Switcher: Competitive vs Board Exams */}
        <div className="flex justify-center mb-8">
          <div className="p-1 rounded-2xl bg-navy-800/80 border border-slate-700/60 inline-flex">
            <button
              onClick={() => setActiveTab('competitive')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'competitive'
                  ? 'bg-electric-blue text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ All-India Competitive Exams
            </button>
            <button
              onClick={() => setActiveTab('boards')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'boards'
                  ? 'bg-neon-purple text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎓 Class 10th & 12th Board Exams
            </button>
          </div>
        </div>

        {activeTab === 'competitive' ? (
          <div>
            {/* Search Bar */}
            <div className="relative mb-6 max-w-md mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search exams (e.g. UPSC, BPSC, SSC, Railway)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-sm text-white placeholder-slate-500"
              />
            </div>

            {/* Exam Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-2">
              {filteredExams.map((item) => {
                const isPrimary = primaryExam === item.id;
                const isAdditional = additionalGoals.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isPrimary
                        ? 'bg-electric-blue/20 border-electric-blue shadow-glow-blue'
                        : isAdditional
                        ? 'bg-navy-800 border-neon-cyan/60'
                        : 'bg-navy-900/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{item.icon}</span>
                      {isPrimary ? (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-electric-blue text-white">
                          Primary Goal
                        </span>
                      ) : isAdditional ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-neon-cyan/20 text-neon-cyan">
                          Added
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-sm font-bold text-white mt-2 mb-1">{item.name}</h3>
                    <div className="text-[11px] text-slate-400">{item.category}</div>

                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => handleSelectPrimary(item.id)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                          isPrimary
                            ? 'bg-electric-blue text-white'
                            : 'bg-navy-800 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {isPrimary ? 'Selected Primary' : 'Set as Primary'}
                      </button>
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleToggleGoal(item.id)}
                          className="text-[11px] font-semibold text-slate-400 hover:text-neon-cyan"
                        >
                          {isAdditional ? 'Remove' : '+ Add Also'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Board Exam Configuration */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Education Board</label>
                <select
                  value={boardConfig.board}
                  onChange={(e) => setBoardConfig({ ...boardConfig, board: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-navy-900"
                >
                  <option value="CBSE">Central Board of Secondary Education (CBSE)</option>
                  <option value="BSEB">Bihar School Examination Board (BSEB)</option>
                  <option value="ICSE">ICSE / ISC Board</option>
                  <option value="UP_BOARD">UP State Board</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Class Level</label>
                <select
                  value={boardConfig.classLevel}
                  onChange={(e) => setBoardConfig({ ...boardConfig, classLevel: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white bg-navy-900"
                >
                  <option value="10">Class 10th Board</option>
                  <option value="12">Class 12th Board</option>
                </select>
              </div>
            </div>

            {boardConfig.classLevel === '12' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Stream Selection</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Science PCM', 'Science PCB', 'Science PCMB', 'Commerce', 'Arts / Humanities'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setBoardConfig({ ...boardConfig, stream: st })}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                        boardConfig.stream === st
                          ? 'bg-neon-purple/20 border-neon-purple text-white shadow-glow-purple'
                          : 'bg-navy-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Study Target Hours */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-xs font-bold text-white">Daily Study Target: {targetHours} Hours</div>
            <div className="text-[11px] text-slate-400">Used by AI Study Coach to structure daily revision</div>
          </div>
          <div className="flex items-center gap-2">
            {[2, 4, 6, 8].map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => setTargetHours(h)}
                className={`w-9 h-9 rounded-xl text-xs font-extrabold border transition-colors ${
                  targetHours === h
                    ? 'bg-electric-blue text-white border-electric-blue shadow-glow-blue'
                    : 'bg-navy-800 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                {h}h
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-electric-blue via-neon-cyan to-neon-purple text-white font-extrabold text-sm shadow-glow-blue hover:brightness-110 transition-all flex items-center gap-2"
          >
            <span>{loading ? 'Personalizing Dashboard...' : 'Launch Personalized Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
