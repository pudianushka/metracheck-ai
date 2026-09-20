import React from 'react';
import { Scale, Scan, AlertTriangle, ArrowLeftRight, Home, Search, ShieldCheck } from 'lucide-react';

export type UserNavTab = 'home' | 'scan' | 'analysis' | 'complaints';

interface UserHeaderProps {
  activeTab: UserNavTab;
  onChangeTab: (tab: UserNavTab) => void;
  onOpenComplaintModal: () => void;
  onSwitchMode: () => void;
  hasActiveAnalysis: boolean;
}

export const UserHeader: React.FC<UserHeaderProps> = ({
  activeTab,
  onChangeTab,
  onOpenComplaintModal,
  onSwitchMode,
  hasActiveAnalysis
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white">MetraCheck AI</span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Consumer Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Verify Product Packaging & Know Your Consumer Rights
            </p>
          </div>
        </div>

        {/* Center / Right Nav */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onChangeTab('home')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => onChangeTab('scan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'scan'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Scan Label</span>
          </button>

          {hasActiveAnalysis && (
            <button
              onClick={() => onChangeTab('analysis')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'analysis'
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Analysis</span>
            </button>
          )}

          <button
            onClick={onOpenComplaintModal}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/30"
            title="Raise a Complaint"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Raise Complaint</span>
          </button>

          {/* Switch Mode */}
          <div className="pl-1 sm:pl-2 border-l border-slate-800 ml-1">
            <button
              onClick={onSwitchMode}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="Switch to Inspector Mode or Mode Selection"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Switch Mode</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
