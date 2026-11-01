import React from 'react';
import appConfig from '../../config/appConfig';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
      <h1 className="text-3xl font-black text-slate-900 dark:text-white">Privacy Policy</h1>
      <p className="text-slate-500 dark:text-slate-400">Last updated: October 2026</p>

      <div className="bg-white dark:bg-navy-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Data Collection & Student Privacy</h2>
        <p>AspirantAI collects only the necessary details required for user authentication (name, email, mobile number) and learning personalization (primary exam choices, quiz attempts, and topic progress).</p>

        <h2 className="text-base font-bold text-white">2. No Plaintext Credential Storage</h2>
        <p>All passwords are encrypted with industry-standard hashing algorithms (bcrypt/Argon2id). OTP tokens are hashed with HMAC SHA-256 and expire strictly after 5 minutes.</p>

        <h2 className="text-base font-bold text-white">3. Data Ownership & Export</h2>
        <p>You may export your complete learning history or submit an account deletion request at any time through the Profile Settings portal.</p>
      </div>
    </div>
  );
}
