import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import CreatorCredit from '../../components/CreatorCredit';
import api from '../../services/api';
import {
  Sparkles, Mail, Lock, Phone, User, CheckCircle2, AlertCircle, ArrowRight,
  Github, KeyRound, Copy, Check, ExternalLink, X, Eye, EyeOff
} from 'lucide-react';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en',
    agreeTerms: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [oauthNotice, setOauthNotice] = useState('');
  const [loading, setLoading] = useState(false);

  // Google OAuth Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleClientSecret, setGoogleClientSecret] = useState('');
  const [savingOAuth, setSavingOAuth] = useState(false);
  const [copiedCallback, setCopiedCallback] = useState(false);

  const callbackUrl = 'http://localhost:5001/api/v1/auth/google/callback';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOAuthClick = async (provider) => {
    setError('');
    setOauthNotice('');
    try {
      const res = await api.get(`/auth/${provider}/url`);
      if (res.data.configured && res.data.url) {
        window.location.href = res.data.url;
      } else {
        if (provider === 'google') {
          setShowGoogleModal(true);
        } else {
          setOauthNotice(
            res.data.message ||
            `${provider === 'google' ? 'Google' : 'GitHub'} OAuth is not configured on the server. Set credentials in server/.env to enable real single sign-in.`
          );
        }
      }
    } catch (err) {
      if (provider === 'google') {
        setShowGoogleModal(true);
      } else {
        setOauthNotice(`Could not initiate ${provider} OAuth flow.`);
      }
    }
  };

  const handleSaveGoogleOAuth = async (e) => {
    e.preventDefault();
    if (!googleClientId || !googleClientSecret) {
      alert('Please enter both Google Client ID and Client Secret.');
      return;
    }

    setSavingOAuth(true);
    try {
      const res = await api.post('/auth/configure-oauth', {
        provider: 'google',
        clientId: googleClientId,
        clientSecret: googleClientSecret
      });

      if (res.data.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        alert('Configuration saved! You can now click Google Sign-In.');
        setShowGoogleModal(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to configure Google OAuth.');
    } finally {
      setSavingOAuth(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopiedCallback(true);
    setTimeout(() => setCopiedCallback(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!formData.agreeTerms) {
      setError('Please accept Terms and Privacy Policy to proceed.');
      return;
    }

    setLoading(true);
    try {
      const data = await signup({
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile || undefined,
        password: formData.password,
        preferredLanguage: formData.preferredLanguage
      });

      if (data.success) {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please check details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl relative"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-electric-blue to-neon-purple p-0.5 mx-auto mb-3 shadow-glow-blue">
            <div className="w-full h-full bg-white dark:bg-navy-900 rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-electric-blue dark:text-neon-cyan" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Start Your Preparation</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Create your AspirantAI account to personalize your study path</p>
        </div>

        {/* OAuth Provider Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthClick('google')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-750 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-white transition shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthClick('github')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-750 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-white transition shadow-sm"
          >
            <Github className="w-4 h-4 text-slate-800 dark:text-white" />
            <span>GitHub</span>
          </button>
        </div>

        {/* OAuth Notice */}
        {oauthNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <span className="leading-relaxed">{oauthNotice}</span>
          </div>
        )}

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-navy-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 absolute">
            or register with email
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-red-950/40 border border-rose-200 dark:border-red-500/40 text-rose-700 dark:text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Priya Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-navy-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@aspirantai.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-navy-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mobile Number (Optional)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-navy-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-navy-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-navy-800/80 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-blue"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-navy-900 text-electric-blue focus:ring-0"
              />
              <span>
                I agree to the{' '}
                <Link to="/terms" className="text-electric-blue dark:text-neon-cyan hover:underline font-medium">Terms</Link> and{' '}
                <Link to="/privacy" className="text-electric-blue dark:text-neon-cyan hover:underline font-medium">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-electric-blue via-neon-cyan to-neon-purple text-white font-extrabold text-sm shadow-glow-blue hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-electric-blue dark:text-neon-cyan font-bold hover:underline">
              Sign In
            </Link>
          </p>
          <div className="mt-4">
            <CreatorCredit />
          </div>
        </div>
      </motion.div>

      {/* Google OAuth Quick Setup Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-lg bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-electric-blue/40 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-electric-blue to-neon-purple p-0.5">
                  <div className="w-full h-full bg-white dark:bg-navy-900 rounded-[10px] flex items-center justify-center">
                    <KeyRound className="w-5 h-5 text-electric-blue dark:text-neon-cyan" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Google OAuth Setup (गूगल लॉगिन)</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure real Google Sign-In with 1 click</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-2 mb-4">
                <p className="font-semibold text-slate-900 dark:text-white">Google Cloud Console से Client ID प्राप्त करने के चरण:</p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  <li>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noreferrer"
                      className="text-electric-blue dark:text-neon-cyan underline font-bold inline-flex items-center gap-1"
                    >
                      Google Cloud Console Credentials <ExternalLink className="w-3 h-3" />
                    </a>
                    पर जाएं।
                  </li>
                  <li><strong>Create Credentials</strong> → <strong>OAuth client ID</strong> → <strong>Web application</strong> चुनें।</li>
                  <li>
                    <strong>Authorized redirect URIs</strong> में नीचे दिए गए URL को पेस्ट करें:
                  </li>
                </ol>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-100 dark:bg-navy-950 border border-slate-300 dark:border-slate-700 font-mono text-[11px] text-electric-blue dark:text-neon-cyan mt-1">
                  <span className="truncate">{callbackUrl}</span>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 text-[10px]"
                  >
                    {copiedCallback ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCallback ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveGoogleOAuth} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Google Client ID</label>
                  <input
                    type="text"
                    required
                    value={googleClientId}
                    onChange={(e) => setGoogleClientId(e.target.value)}
                    placeholder="xxxxxxxxxxxx.apps.googleusercontent.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Google Client Secret</label>
                  <input
                    type="password"
                    required
                    value={googleClientSecret}
                    onChange={(e) => setGoogleClientSecret(e.target.value)}
                    placeholder="GOCSPX-xxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-electric-blue"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={savingOAuth}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-electric-blue to-neon-purple text-white font-bold text-xs shadow-glow-blue hover:brightness-110 disabled:opacity-50"
                  >
                    {savingOAuth ? 'Saving & Connecting...' : 'Save & Register with Google'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-navy-800"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
