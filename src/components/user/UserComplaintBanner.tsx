import React from 'react';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';

interface UserComplaintBannerProps {
  onOpenComplaintForm: () => void;
}

export const UserComplaintBanner: React.FC<UserComplaintBannerProps> = ({
  onOpenComplaintForm
}) => {
  return (
    <div
      style={{
        backgroundColor: 'rgba(220, 38, 38, 0.10)',
        borderColor: 'rgba(220, 38, 38, 0.35)'
      }}
      className="border rounded-2xl p-4 sm:p-5 shadow-sm transition-all relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>FOUND AN ISSUE WITH A PRODUCT?</span>
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-500/40 rounded">
                Consumer Grievance
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Raise a complaint about incorrect MRP, deceptive quantity, missing packing date, omitted manufacturer address, or unreadable packaging.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenComplaintForm}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/40 flex items-center justify-center gap-2 transition-all shrink-0 active:scale-[0.98]"
        >
          <span>Raise a Complaint</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
