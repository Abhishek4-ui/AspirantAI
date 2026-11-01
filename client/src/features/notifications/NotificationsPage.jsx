import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Bell, CheckCircle2, Zap, Award, Calendar } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/mark-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Quiz alerts, revision reminders, and vacancy notifications</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-neon-cyan hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 dark:text-slate-400">Loading alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-xs text-slate-500 dark:text-slate-400">
          No active notifications.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                n.isRead
                  ? 'bg-slate-50 dark:bg-navy-900/60 border-slate-200 dark:border-slate-800/80 text-slate-500 dark:text-slate-400'
                  : 'bg-white dark:bg-navy-800/80 border-electric-blue/40 text-slate-900 dark:text-white shadow-sm dark:shadow-glow-blue'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-electric-blue/20 text-neon-cyan flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link to={n.link} className="text-[11px] font-bold text-neon-cyan hover:underline mt-2 inline-block">
                    Open Action →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
