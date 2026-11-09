import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSessionToken } = useAuth();
  const [status, setStatus] = useState('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const provider = searchParams.get('provider') || localStorage.getItem('aspirantai_oauth_provider') || 'google';

    if (error) {
      setStatus('error');
      setErrorMessage(decodeURIComponent(error));
      return;
    }

    if (token) {
      try {
        setSessionToken(token);
        setStatus('success');
        const timer = setTimeout(() => {
          navigate('/dashboard');
        }, 1200);
        return () => clearTimeout(timer);
      } catch (err) {
        setStatus('error');
        setErrorMessage('Failed to finalize authentication session.');
      }
      return;
    }

    if (code) {
      setStatus('processing');
      const normalizedProvider = provider.toLowerCase().includes('git') ? 'github' : 'google';
      api.post(`/auth/${normalizedProvider}/callback`, { code })
        .then((res) => {
          if (!isMounted) return;
          if (res.data?.token) {
            setSessionToken(res.data.token);
            setStatus('success');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1200);
          } else {
            setStatus('error');
            setErrorMessage('Could not retrieve session token.');
          }
        })
        .catch((err) => {
          if (!isMounted) return;
          setStatus('error');
          setErrorMessage(
            err.response?.data?.message || err.message || 'OAuth verification failed.'
          );
        });
      return;
    }

    setStatus('error');
    setErrorMessage('No authentication token or authorization code received from identity provider.');

    return () => {
      isMounted = false;
    };
  }, [searchParams, setSessionToken, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 border border-electric-blue/30 shadow-2xl text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-electric-blue/20 border border-electric-blue/40 flex items-center justify-center mx-auto mb-4 text-neon-cyan">
          <Sparkles className="w-7 h-7" />
        </div>

        {status === 'processing' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Finalizing Authentication</h2>
            <p className="text-xs text-slate-400">Verifying secure OAuth session token with AspirantAI...</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Authentication Successful!</h2>
            <p className="text-xs text-slate-400">Redirecting to your personalized study dashboard...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Authentication Notice</h2>
            <p className="text-xs text-red-300 mb-6 bg-red-950/40 p-3 rounded-xl border border-red-500/30">
              {errorMessage}
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-electric-blue text-white text-xs font-bold shadow-glow-blue hover:brightness-110"
            >
              Return to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
