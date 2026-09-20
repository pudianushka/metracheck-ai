import React from 'react';
import {
  Scale,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Scan,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  Inbox,
  ClipboardList
} from 'lucide-react';

interface ModeSelectionScreenProps {
  onSelectMode?: (mode: 'user' | 'inspector') => void;
  onSelectUserMode?: () => void;
  onSelectInspectorMode?: () => void;
  isInspectorAuthenticated?: boolean;
  complaintCount?: number;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  onSelectMode,
  onSelectUserMode,
  onSelectInspectorMode,
  isInspectorAuthenticated = false,
  complaintCount = 0
}) => {
  const handleUserClick = () => {
    if (onSelectUserMode) onSelectUserMode();
    if (onSelectMode) onSelectMode('user');
  };

  const handleInspectorClick = () => {
    if (onSelectInspectorMode) onSelectInspectorMode();
    if (onSelectMode) onSelectMode('inspector');
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-slate-950">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="w-full max-w-5xl z-10 space-y-8 my-auto py-8">
        {/* Top Header & Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Government of India • Directorate of Legal Metrology</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3">
            <span>METRACHECK AI</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-400 font-medium">
            AI-Assisted Legal Metrology Compliance Platform
          </p>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Choose how you want to use MetraCheck. Whether you are a consumer inspecting packaged goods or an authorized enforcement officer verifying statutory rules.
          </p>
        </div>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* USER MODE CARD */}
          <div className="relative group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-emerald-950/20">
            {/* Top Tag */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Consumer Portal
                </span>
                <span className="text-[11px] font-semibold text-emerald-400/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  No Account Required
                </span>
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                  <UserCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  USER MODE
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  For consumers, citizens & retail shoppers
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Scan consumer product labels, understand statutory declarations (MRP, net quantity, dates), identify misleading packaging, and report consumer grievances directly.
              </p>

              {/* Feature Bullets */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Available Features:
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Scan className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Scan product labels with camera or photo upload</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Search className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Analyze extracted packaging declarations</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Understand potential issues in plain language</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-rose-200/90 font-medium">Raise a product complaint directly</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={handleUserClick}
                className="w-full py-3.5 px-5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/30 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-200"
              >
                <span>Continue as User</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Instant access • No login or sign-up needed
              </p>
            </div>
          </div>

          {/* INSPECTOR MODE CARD */}
          <div className="relative group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-blue-950/20">
            {/* Top Tag */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-500/30">
                  Enforcement Workspace
                </span>
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  {isInspectorAuthenticated ? 'Authenticated' : 'Auth Required'}
                </span>
              </div>

              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  INSPECTOR MODE
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  For authorized Legal Metrology inspectors & officers
                </p>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Conduct field audits, investigate citizen complaints, verify Rule 6(1) declarations, examine optical character height, and generate statutory digital inspection reports.
              </p>

              {/* Feature Bullets */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Inspector Capabilities:
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2.5">
                    <Inbox className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Receive and manage citizen grievances</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <ClipboardList className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Conduct field inspections & AI evidence audits</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Verify findings & record officer enforcement actions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Generate official digital inspection certificates</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Scale className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Rule reference manual & jurisdictional profile</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={handleInspectorClick}
                className="w-full py-3.5 px-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-950/40 flex items-center justify-center gap-2 group-hover:gap-3 transition-all duration-200"
              >
                <span>{isInspectorAuthenticated ? 'Enter Inspector Workspace' : 'Inspector Login'}</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Authorized field officers • Demo fast-pass included
              </p>
            </div>
          </div>
        </div>

        {/* Statutory Reference Footer */}
        <div className="pt-4 text-center text-xs text-slate-500 space-y-1">
          <p>
            Framework: The Legal Metrology Act, 2009 & The Legal Metrology (Packaged Commodities) Rules, 2011 (India)
          </p>
          <p className="text-[11px] text-slate-600">
            Demo inspection and grievance recording environment • AI provides automated assistance and does not supersede statutory authority.
          </p>
        </div>
      </div>
    </div>
  );
};
