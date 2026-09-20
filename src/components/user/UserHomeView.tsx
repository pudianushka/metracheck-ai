import React from 'react';
import {
  Scan,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  DollarSign,
  Package,
  PhoneCall,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserComplaintBanner } from './UserComplaintBanner';
import { DEMO_IMAGE_COMPLIANT, DEMO_IMAGE_VIOLATION, DEMO_IMAGE_REVIEW } from '../../data/demoData';

interface UserHomeViewProps {
  onScanNew: () => void;
  onOpenComplaintModal: (prefill?: any) => void;
  onLaunchDemoPreset: (preset: 'compliant' | 'violation' | 'review') => void;
}

export const UserHomeView: React.FC<UserHomeViewProps> = ({
  onScanNew,
  onOpenComplaintModal,
  onLaunchDemoPreset
}) => {
  return (
    <div className="space-y-6 pb-20">
      {/* 1. REQUIRED TOP RED COMPLAINT BANNER (Prompt section 6 & 19) */}
      <UserComplaintBanner onOpenComplaintForm={() => onOpenComplaintModal()} />

      {/* 2. Hero Action Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Consumer Package Label Auditor</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Check If Packaged Goods Follow Indian Consumer Protection Rules
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            By law in India, every pre-packaged commodity must declare clear details on its packaging—including MRP inclusive of all taxes, net weight in standard metric units, manufacturing date, and customer care info.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onScanNew}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Scan className="w-4 h-4 stroke-[2.5]" />
              <span>Scan Product Label Now</span>
            </button>

            <button
              onClick={() => onOpenComplaintModal()}
              className="px-5 py-3.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Report Non-Compliant Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Instant Jury Demonstration Presets for Consumers */}
      <div className="p-4 bg-slate-900/90 border border-emerald-500/25 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              Instant Demonstration Packages
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any package to test AI extraction:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onLaunchDemoPreset('compliant')}
            className="p-3.5 bg-slate-950 hover:bg-slate-850 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                Ananda Herbal Tea
              </div>
              <div className="text-[11px] text-emerald-400/90 truncate">
                Fully Compliant Packaging
              </div>
            </div>
          </button>

          <button
            onClick={() => onLaunchDemoPreset('violation')}
            className="p-3.5 bg-slate-950 hover:bg-slate-850 border border-rose-500/30 hover:border-rose-500/60 rounded-xl transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 group-hover:text-rose-400 transition-colors">
                Crispy Butter Cookies
              </div>
              <div className="text-[11px] text-rose-400/90 truncate">
                Missing Packing Date (Issue)
              </div>
            </div>
          </button>

          <button
            onClick={() => onLaunchDemoPreset('review')}
            className="p-3.5 bg-slate-950 hover:bg-slate-850 border border-amber-500/30 hover:border-amber-500/60 rounded-xl transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                AyurVeda Chyawanprash
              </div>
              <div className="text-[11px] text-amber-400/90 truncate">
                Low Contrast Helpline (Review)
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Consumer Rights Education Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          Mandatory Declarations Every Product Must Have
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Card 1 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">1. Maximum Retail Price (MRP)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Must state &ldquo;Inclusive of all taxes&rdquo;. Retailers cannot charge GST or refrigeration charges above the printed MRP.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">2. Net Quantity</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Must be declared in metric units (g, kg, ml, l) without misleading qualifiers like &ldquo;approximate&rdquo; or &ldquo;when packed&rdquo;.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">3. Month & Year of Packing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables consumers to know the packaging age of the product. Packages cannot omit the manufacturing or import date.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">4. Manufacturer or Importer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Must provide complete name and physical address of manufacturer, packer, or importer for accountability.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">5. Consumer Grievance Cell</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mandatory phone number, email ID, and postal address of the grievance officer to address consumer complaints.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <h4 className="text-sm font-bold text-white mt-2">Spotted a Non-Compliance?</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Report it through our portal. Complaints are logged for review by field enforcement officers.
              </p>
            </div>
            <button
              onClick={() => onOpenComplaintModal()}
              className="mt-2 text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
            >
              <span>Submit a complaint now</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
