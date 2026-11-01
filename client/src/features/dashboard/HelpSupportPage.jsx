import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import appConfig from '../../config/appConfig';

export default function HelpSupportPage() {
  const [ticketSent, setTicketSent] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicketSent(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="text-center max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Help & Support Center</h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">Have a question regarding exam syllabus, test scoring, or account access? We are here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">How is the Daily 100-Question Quiz evaluated?</strong>
              <p className="text-slate-600 dark:text-slate-400">All submissions are evaluated on the server with negative marking (-0.66) to ensure absolute test integrity.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-slate-800">
              <strong className="text-slate-900 dark:text-white block mb-1">Does switching language reset my answers?</strong>
              <p className="text-slate-600 dark:text-slate-400">No. Hindi/English switching is non-destructive and preserves your timer, responses, and question state.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-navy-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Submit a Support Ticket</h2>

          {ticketSent && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ticket submitted successfully! We will get back to you shortly.</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Issue Topic</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Question feedback or account query"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Query</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your query in detail..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-navy-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
