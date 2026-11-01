import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Shield, Users, Database, Server, CheckCircle2, AlertTriangle,
  RefreshCw, Key, Cloud, Cpu, Activity, Clock
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [configStatus, setConfigStatus] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('config'); // 'config', 'users', 'logs'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, configRes, logsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { stats: null } })),
        api.get('/admin/users').catch(() => ({ data: { users: [] } })),
        api.get('/admin/config-status').catch(() => ({ data: null })),
        api.get('/admin/audit-logs').catch(() => ({ data: { logs: [] } }))
      ]);

      if (statsRes.data?.success) setStats(statsRes.data.stats);
      if (usersRes.data?.success) setUsers(usersRes.data.users);
      if (configRes.data?.success) setConfigStatus(configRes.data);
      if (logsRes.data?.success) setAuditLogs(logsRes.data.logs);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Role modification failed');
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-xs text-slate-400">Loading system management metrics...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-xs font-bold mb-2">
            <Shield className="w-3.5 h-3.5" /> Server-Enforced RBAC & Governance
          </div>
          <h1 className="text-3xl font-black text-white">System Administration</h1>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
        </button>
      </div>

      {/* Telemetry Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4 border border-slate-800">
          <div className="text-2xl font-black text-white">{stats?.totalUsers || 0}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Registered Users</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-electric-blue/30">
          <div className="text-2xl font-black text-neon-cyan">{stats?.totalQuestions || 0}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Verified Questions</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30">
          <div className="text-2xl font-black text-emerald-400">{stats?.totalQuizzes || 0}</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Active Quizzes</div>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-neon-purple/30">
          <div className="text-2xl font-black text-neon-purple">{stats?.uptimeSeconds || 0}s</div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-1">Node Process Uptime</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('config')}
          className={`px-5 py-3 border-b-2 transition ${
            activeTab === 'config'
              ? 'border-electric-blue text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Environment & Providers Status
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-5 py-3 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-electric-blue text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-5 py-3 border-b-2 transition ${
            activeTab === 'logs'
              ? 'border-electric-blue text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Configuration Status */}
      {activeTab === 'config' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cloud className="w-4 h-4 text-neon-cyan" /> Central Service Provider Telemetry
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Environment: <strong className="text-white">{configStatus?.environment || 'development'}</strong>
            </span>
          </div>

          <p className="text-xs text-slate-400">
            This dashboard displays the live connectivity and presence of environment variables without ever exposing raw secrets or private tokens.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(configStatus?.providers || []).map((p, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-navy-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-xs">{p.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.configured
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : p.required
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {p.configured ? 'Configured' : p.required ? 'Required (Missing)' : 'Optional (Unconfigured)'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mb-2 font-mono text-electric-blue">{p.keyName}</div>
                  <p className="text-xs text-slate-300">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: User Management Table */}
      {activeTab === 'users' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-neon-cyan" /> User Management & RBAC Permissions
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Email</th>
                  <th className="pb-3 font-semibold">Provider</th>
                  <th className="pb-3 font-semibold">Current Role</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u._id} className="text-slate-300">
                    <td className="py-3 font-semibold text-white">{u.name}</td>
                    <td className="py-3 font-mono">{u.email}</td>
                    <td className="py-3 font-semibold text-slate-400 uppercase text-[10px]">{u.authProvider || 'local'}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        u.role === 'admin'
                          ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/40'
                          : u.role === 'contentManager' || u.role === 'contentReviewer'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-navy-800 text-slate-400 border border-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 rounded-lg glass-input text-xs text-white bg-navy-900 border border-slate-700"
                      >
                        <option value="student">Student</option>
                        <option value="contentReviewer">Content Reviewer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Activity className="w-4 h-4 text-neon-cyan" /> Administrative Audit Trail
          </h3>

          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-400">No administrative events recorded yet.</p>
          ) : (
            <div className="divide-y divide-slate-800 text-xs">
              {auditLogs.map((log) => (
                <div key={log._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="font-bold text-neon-cyan font-mono">{log.action}</span>
                    <span className="text-slate-400 ml-2">by {log.adminEmail}</span>
                    <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                      Target: {log.targetEntity} {log.targetId ? `(${log.targetId})` : ''}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
