import React from 'react';
import { Link } from 'react-router-dom';
import appConfig from '../config/appConfig';

export default function CreatorCredit({ className = '' }) {
  return (
    <div className={`inline-flex items-center gap-2 text-xs text-slate-300 ${className}`}>
      <img
        src={appConfig.CREATOR_PHOTO}
        alt={appConfig.CREATOR_NAME}
        className="w-5 h-5 rounded-full object-cover border border-cyan-400 shadow"
        onError={(e) => { e.target.style.display = 'none'; }}
      />
      <span className="font-semibold text-white">{appConfig.CREATOR_CREDIT}</span>
      <span className="text-slate-600">•</span>
      <Link
        to="/developer"
        className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium underline underline-offset-2"
      >
        View Profile
      </Link>
    </div>
  );
}
