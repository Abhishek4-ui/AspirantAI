import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar, Plus, Filter, ExternalLink, Trash2, CheckCircle2,
  Clock, AlertCircle, ShieldCheck, Tag, X
} from 'lucide-react';

const CATEGORIES = [
  'All', 'UPSC', 'BPSC', 'SSC', 'GATE', 'Banking', 'Railway',
  'Job', 'Internship', 'Interview', 'Personal Study'
];

export default function ExamCalendarPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Personal Study',
    eventType: 'study_reminder',
    eventDate: '',
    notes: '',
    officialNotificationUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/calendar', {
        params: { category: selectedCategory !== 'All' ? selectedCategory : undefined }
      });
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Failed to fetch calendar events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/calendar', formData);
      if (res.data.success) {
        setShowAddModal(false);
        setFormData({
          title: '',
          category: 'Personal Study',
          eventType: 'study_reminder',
          eventDate: '',
          notes: '',
          officialNotificationUrl: ''
        });
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to create calendar event:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/calendar/${id}`);
      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-400" />
              Unified Exam & Important Dates Calendar
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Confirmed dates for UPSC, BPSC, GATE, SSC, plus job deadlines, interview schedules, and personal reminders.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Reminder / Target
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl border transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-500 text-white shadow'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Calendar Events List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading calendar milestones...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            No events found for this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(ev => {
              const eventDate = new Date(ev.eventDate);
              const isPast = eventDate < new Date();

              return (
                <div
                  key={ev._id}
                  className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {ev.category}
                      </span>
                      {ev.isOfficial ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Official
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Personal
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug">{ev.title}</h3>
                    {ev.hindiTitle && (
                      <p className="text-xs text-purple-300">{ev.hindiTitle}</p>
                    )}
                    {ev.notes && (
                      <p className="text-xs text-slate-400 leading-relaxed">{ev.notes}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Date:
                      </span>
                      <span className={`font-semibold ${isPast ? 'text-slate-500' : 'text-purple-300'}`}>
                        {eventDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      {ev.officialNotificationUrl ? (
                        <a
                          href={ev.officialNotificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Official Notice <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : <span />}

                      {!ev.isOfficial && (
                        <button
                          onClick={() => handleDelete(ev._id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                          title="Delete Reminder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Add Personal Milestone or Reminder</h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. BPSC Prelims Target Revision, Mock Test 3..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Target Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Notes / Target Chapters</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Syllabus topics to complete before this date..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                  >
                    Save Reminder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
