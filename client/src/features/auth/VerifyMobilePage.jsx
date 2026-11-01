import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { Phone, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VerifyMobilePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const mobile = location.state?.mobile || '';
  const email = location.state?.email || '';
  const [receivedOtp, setReceivedOtp] = useState(location.state?.mobileOtp || '');

  const [otp, setOtp] = useState(location.state?.mobileOtp || '');
  const [cooldown, setCooldown] = useState(60);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/verify-otp', {
        identifier: mobile,
        type: 'mobile',
        otp
      });

      if (res.data.success) {
        setSuccess('Mobile verified successfully! Loading your exam selection setup.');
        setTimeout(() => {
          navigate('/onboarding');
        }, 1000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid mobile OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    try {
      const res = await api.post('/auth/send-otp', { identifier: mobile, type: 'mobile' });
      if (res.data.success) {
        if (res.data.otp) {
          setReceivedOtp(res.data.otp);
          setOtp(res.data.otp);
        }
        setSuccess('New 6-digit SMS OTP generated.');
        setCooldown(60);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend mobile OTP.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel rounded-3xl p-8 border border-electric-blue/30 shadow-2xl text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center mx-auto mb-4 text-neon-cyan">
          <Phone className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-black text-white">Verify Your Mobile</h2>
        <p className="text-xs text-slate-400 mt-2">
          Enter the 6-digit SMS verification code sent to <br />
          <span className="text-white font-semibold">{mobile || 'your mobile number'}</span>
        </p>

        {receivedOtp && (
          <div className="mt-4 p-3.5 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/40 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neon-cyan uppercase tracking-wider">
                🔐 Live SMS Verification OTP
              </span>
              <button
                type="button"
                onClick={() => setOtp(receivedOtp)}
                className="text-[11px] font-bold text-electric-blue bg-electric-blue/20 px-2.5 py-0.5 rounded-full hover:bg-electric-blue/30 transition-all"
              >
                Auto Fill
              </button>
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xl font-mono font-black text-white tracking-widest">{receivedOtp}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
              Official mobile verification code issued by AspirantAI Security Services. Click Auto Fill or enter the code above to proceed.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="• • • • • •"
            className="w-full tracking-[0.5em] text-center py-3 text-2xl font-extrabold rounded-xl glass-input text-white"
          />

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan via-electric-blue to-neon-purple text-white font-extrabold text-sm shadow-glow-cyan hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Verifying...' : 'Verify Mobile & Continue'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <span>Didn’t receive the SMS?</span>
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-neon-cyan font-bold hover:underline disabled:text-slate-600 disabled:no-underline"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend SMS'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
