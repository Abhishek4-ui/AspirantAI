import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Plus, Key, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';

export default function StudyGroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState('');
  const [examCategory, setExamCategory] = useState('Civil Services');
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/study-groups');
      if (res.data.success) {
        setGroups(res.data.groups);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await api.post('/study-groups', {
        name,
        examCategory,
        isPrivate
      });
      if (res.data.success) {
        setGroups([...groups, res.data.group]);
        setCreateModalOpen(false);
        setName('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleJoin = async (groupId) => {
    try {
      const res = await api.post('/study-groups/join', { groupId, joinCode });
      if (res.data.success) {
        fetchGroups();
        setJoinCode('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not join group');
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Friends & Study Groups</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Form private peer study squads, track collective weekly targets, and solve quizzes together.</p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Study Squad
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading study groups...</div>
      ) : groups.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400">
          No public study groups yet. Create the first squad for your exam!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((g) => {
            const isMember = g.members?.some(m => m.userId === user?._id || m.userId?._id === user?._id);

            return (
              <div key={g._id} className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-800 text-neon-cyan border border-slate-200 dark:border-slate-700">
                      {g.examCategory}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{g.members?.length || 1} Members</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{g.name}</h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Created by: <strong className="text-slate-700 dark:text-slate-300">{g.creatorId?.name || 'Peer Aspirant'}</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between mb-4">
                    <span>Weekly Target: {g.weeklyStudyTargetHours || 25} Hours</span>
                    <span className="text-neon-cyan font-bold">Group Score: {g.groupScore || 0} pts</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  {isMember ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> You are a member
                    </span>
                  ) : (
                    <button
                      onClick={() => handleJoin(g._id)}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-neon-cyan"
                    >
                      Join Squad
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateGroup} className="glass-panel max-w-md w-full rounded-3xl p-6 border border-slate-200 dark:border-electric-blue/40 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create Study Squad</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Squad Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. UPSC Prelims Warriors 2026"
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Exam Category</label>
              <select
                value={examCategory}
                onChange={(e) => setExamCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              >
                <option value="Civil Services">Civil Services</option>
                <option value="SSC">SSC</option>
                <option value="Railway">Railway</option>
                <option value="Banking">Banking</option>
                <option value="Class 10/12">Class 10/12 Boards</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl glass-panel text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold"
              >
                Create Squad
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
