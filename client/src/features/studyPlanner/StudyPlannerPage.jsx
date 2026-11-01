import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, CheckCircle2, Circle, Plus, Clock, Target, ArrowRight } from 'lucide-react';

export default function StudyPlannerPage() {
  const [plan, setPlan] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await api.get('/study-planner');
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const res = await api.post('/study-planner/task/toggle', { taskId });
      if (res.data.success) {
        setPlan(res.data.plan);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const res = await api.post('/study-planner/task/add', {
        title: newTaskTitle,
        subject: newTaskSubject || 'General',
        durationMinutes: 45
      });
      if (res.data.success) {
        setPlan(res.data.plan);
        setNewTaskTitle('');
        setNewTaskSubject('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="py-20 text-center text-xs text-slate-400">Loading your customized study schedule...</div>;

  const targetDate = plan?.targetExamDate ? new Date(plan.targetExamDate) : new Date();
  const diffDays = Math.max(0, Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      
      {/* Header & Exam Countdown */}
      <div className="glass-panel rounded-3xl p-8 border border-electric-blue/30 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-navy-800 text-neon-cyan border border-slate-300 dark:border-slate-700">
            Target Exam: {plan?.targetExam || 'Competitive Exam'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-3">Smart Study Planner</h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Structured schedule designed to maintain steady daily syllabus velocity.</p>
        </div>

        {/* Countdown Pill */}
        <div className="text-center p-4 rounded-2xl bg-white dark:bg-navy-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
          <div className="text-3xl font-black text-neon-cyan">{diffDays}</div>
          <div className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">Days to Exam</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Tasks List */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neon-cyan" /> Today's Scheduled Tasks
            </h3>
            <span className="text-xs text-slate-400">
              {plan?.dailyTasks?.filter(t => t.isCompleted).length} / {plan?.dailyTasks?.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {plan?.dailyTasks?.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  task.isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-500 dark:text-slate-400'
                    : 'bg-white dark:bg-navy-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-blue-400 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  {task.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`text-xs sm:text-sm font-semibold ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-slate-500">{task.subject}</span>
                  </div>
                </div>

                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {task.durationMinutes}m
                </span>
              </div>
            ))}
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add custom task (e.g. Revise Modern History 1857)..."
              className="flex-1 px-4 py-2 rounded-xl glass-input text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold hover:brightness-110 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </form>
        </div>

        {/* Milestones & Syllabus Velocity */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Weekly Milestones
          </h3>

          <div className="space-y-4">
            {plan?.weeklyMilestones?.map((m) => (
              <div key={m.weekNumber} className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">Week {m.weekNumber}: {m.title}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.isAchieved ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {m.isAchieved ? 'Achieved' : 'In Progress'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Target: {m.targetChapters.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
