import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Briefcase, Plus, Filter, Calendar, ExternalLink, Trash2, Edit3,
  CheckCircle, Clock, AlertCircle, FileText, ChevronRight, X
} from 'lucide-react';

const STAGES = [
  'All', 'Interested', 'Preparing to Apply', 'Applied',
  'Assessment', 'Interview', 'Offer Received', 'Rejected', 'Withdrawn'
];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState([]);
  const [stageCounts, setStageCounts] = useState({});
  const [selectedStage, setSelectedStage] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    status: 'Applied',
    notes: '',
    officialUrl: '',
    deadline: '',
    interviewDate: ''
  });

  useEffect(() => {
    fetchApplications();
  }, [selectedStage]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications', {
        params: { status: selectedStage !== 'All' ? selectedStage : undefined }
      });
      if (res.data.success) {
        setApplications(res.data.applications);
        setStageCounts(res.data.stageCounts || {});
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingApp) {
        await api.put(`/applications/${editingApp._id}`, formData);
      } else {
        await api.post('/applications', formData);
      }
      setShowAddModal(false);
      setEditingApp(null);
      setFormData({ title: '', company: '', status: 'Applied', notes: '', officialUrl: '', deadline: '', interviewDate: '' });
      fetchApplications();
    } catch (err) {
      console.error('Failed to save application:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this application from tracker?')) return;
    try {
      await api.delete(`/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  const openEdit = (app) => {
    setEditingApp(app);
    setFormData({
      title: app.title,
      company: app.company,
      status: app.status,
      notes: app.notes || '',
      officialUrl: app.officialUrl || '',
      deadline: app.deadline ? app.deadline.split('T')[0] : '',
      interviewDate: app.interviewDate ? app.interviewDate.split('T')[0] : ''
    });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-blue-400" />
              Career Application Tracker
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Private candidate pipeline to manage all your job, internship, and vacancy applications in one place.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingApp(null);
              setFormData({ title: '', company: '', status: 'Applied', notes: '', officialUrl: '', deadline: '', interviewDate: '' });
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Track New Application
          </button>
        </div>

        {/* Pipeline Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {STAGES.filter(s => s !== 'All').map(stage => (
            <button
              key={stage}
              onClick={() => setSelectedStage(stage === selectedStage ? 'All' : stage)}
              className={`p-3 rounded-xl border text-left transition ${
                selectedStage === stage
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xl font-bold text-white">{stageCounts[stage] || 0}</div>
              <div className="text-[11px] truncate">{stage}</div>
            </button>
          ))}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading tracked applications...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-3">
            <p className="text-base font-medium text-slate-300">No applications recorded in this stage.</p>
            <p className="text-xs text-slate-500">
              Bookmark listings from the Internship or Job Portals, or click "Track New Application" to add your off-campus applications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map(app => (
              <div
                key={app._id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      app.status === 'Offer Received' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      app.status === 'Interview' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      app.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-500">Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{app.title}</h3>
                  <p className="text-sm text-slate-300 font-medium">{app.company}</p>
                  {app.notes && (
                    <p className="text-xs text-slate-400 italic pt-1">{app.notes}</p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto justify-end">
                  {app.interviewDate && (
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Interview: {new Date(app.interviewDate).toLocaleDateString()}
                    </div>
                  )}

                  {app.officialUrl && (
                    <a
                      href={app.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Open Careers Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => openEdit(app)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="Edit Status & Notes"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(app._id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    title="Delete Application"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Add / Edit */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">
                  {editingApp ? 'Update Application' : 'Track New Application'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block text-slate-300 mb-1">Job / Internship Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Associate Software Engineer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="e.g. Infosys, TCS, Google"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Pipeline Stage</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                      {STAGES.filter(s => s !== 'All').map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Interview Date (if scheduled)</label>
                    <input
                      type="date"
                      value={formData.interviewDate}
                      onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Official Application or Job URL</label>
                  <input
                    type="url"
                    value={formData.officialUrl}
                    onChange={(e) => setFormData({ ...formData, officialUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Private Notes</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Interview rounds, recruiter contact, topics to revise..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                  >
                    {editingApp ? 'Save Changes' : 'Add to Pipeline'}
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
