import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Scan,
  ArrowRight,
  ShieldCheck,
  Building,
  DollarSign,
  Calendar,
  Phone,
  Package,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Inbox
} from 'lucide-react';
import { InspectionRecord, OverallComplianceStatus, DeclarationField } from '../../types';

interface UserAnalysisResultViewProps {
  record: InspectionRecord;
  onScanAnother: () => void;
  onRaiseComplaint: (prefill: {
    productName: string;
    brand?: string;
    category?: string;
    evidenceImage?: string;
    description?: string;
    complaintType?: any;
  }) => void;
}

export const UserAnalysisResultView: React.FC<UserAnalysisResultViewProps> = ({
  record,
  onScanAnother,
  onRaiseComplaint
}) => {
  const [showEvidencePhoto, setShowEvidencePhoto] = useState<boolean>(true);

  // Map outcome to user-friendly consumer labels
  // ✓ No apparent issue detected
  // ⚠ Potential issue detected
  // ◌ Unable to verify / needs review
  const getConsumerOutcome = () => {
    switch (record.overallStatus) {
      case 'COMPLIANT':
        return {
          title: '✓ No Apparent Issue Detected',
          badgeText: 'Likely Compliant',
          subtitle: 'The packaging declarations examined match statutory standards under the Packaged Commodities Rules.',
          bgColor: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
          icon: CheckCircle2,
          iconColor: 'text-emerald-400'
        };
      case 'POTENTIAL_NON_COMPLIANCE':
        return {
          title: '⚠ Potential Issue Detected',
          badgeText: 'Potential Non-Compliance Detected',
          subtitle: 'One or more mandatory declarations may be missing, unclear, or non-compliant with consumer protection standards.',
          bgColor: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
          icon: AlertTriangle,
          iconColor: 'text-rose-400'
        };
      case 'REVIEW':
      default:
        return {
          title: '◌ Unable to Verify / Needs Review',
          badgeText: 'Manual Review Needed',
          subtitle: 'Some packaging text could not be verified with high certainty due to image clarity, glare, or label orientation.',
          bgColor: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
          icon: HelpCircle,
          iconColor: 'text-amber-400'
        };
    }
  };

  const outcome = getConsumerOutcome();
  const OutcomeIcon = outcome.icon;

  const handleComplaintPrefill = () => {
    // Determine complaint type based on first flagged issue
    let complaintType: any = 'Missing declaration';
    let issueDescription = `I checked this product with MetraCheck AI scanner and identified potential issues with its packaging:\n`;

    if (record.issues && record.issues.length > 0) {
      record.issues.forEach((issue) => {
        issueDescription += `• ${issue.title}: ${issue.description}\n`;
      });
      const firstIssue = record.issues[0].title.toLowerCase();
      if (firstIssue.includes('mrp') || firstIssue.includes('tax')) {
        complaintType = 'Incorrect MRP';
      } else if (firstIssue.includes('date') || firstIssue.includes('month') || firstIssue.includes('packing')) {
        complaintType = 'Date declaration issue';
      } else if (firstIssue.includes('quantity') || firstIssue.includes('weight')) {
        complaintType = 'Incorrect / unclear quantity';
      } else if (firstIssue.includes('consumer') || firstIssue.includes('care') || firstIssue.includes('helpline')) {
        complaintType = 'Consumer care information issue';
      } else if (firstIssue.includes('manufacturer') || firstIssue.includes('packer')) {
        complaintType = 'Manufacturer / packer / importer issue';
      }
    } else {
      issueDescription += `Product: ${record.productName}`;
    }

    onRaiseComplaint({
      productName: record.productName,
      brand: record.brand,
      category: record.category,
      evidenceImage: record.imageDataUrl,
      description: issueDescription,
      complaintType
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Main Status Banner */}
      <div className={`p-5 sm:p-6 border rounded-2xl shadow-xl space-y-3 ${outcome.bgColor}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-current/30 flex items-center justify-center shrink-0">
              <OutcomeIcon className={`w-7 h-7 ${outcome.iconColor}`} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block opacity-90">
                {outcome.badgeText}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {outcome.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleComplaintPrefill}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-rose-950/40 flex items-center gap-2 transition-all shrink-0"
            >
              <Inbox className="w-4 h-4" />
              <span>Raise Complaint for this Product</span>
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm leading-relaxed text-slate-200">
          {outcome.subtitle}
        </p>
      </div>

      {/* 2. Product Summary & Evidence Toggle */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Scanned Packaging
            </span>
            <h2 className="text-lg font-bold text-white">
              {record.productName}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Brand: {record.brand || 'Unspecified'} • Category: {record.category}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEvidencePhoto(!showEvidencePhoto)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>{showEvidencePhoto ? 'Hide Label Photo' : 'Show Label Photo'}</span>
              {showEvidencePhoto ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {showEvidencePhoto && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="md:col-span-1 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
              <img
                src={record.imageDataUrl}
                alt={record.productName}
                className="max-h-64 w-auto object-contain rounded-lg shadow"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="md:col-span-2 space-y-3 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Inspection Summary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Declarations Verified</span>
                  <span className="font-bold text-white text-sm">
                    {record.declarations.filter(d => d.detected).length} of {record.declarations.length} Detected
                  </span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <span className="text-slate-400 block text-[11px]">Compliance Score</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {record.scores.overallPercentage}% Match
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                This automated check reads the packaging text against the mandatory standards of the Legal Metrology (Packaged Commodities) Rules, 2011.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Consumer Explanation Breakdown: What was detected, Why it may be an issue, What could not be verified */}
      <div className="space-y-4">
        {/* Identified Issues / Non-compliances */}
        {record.issues && record.issues.length > 0 ? (
          <div className="bg-slate-900 border border-rose-900/40 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-white">
                Potential Issues Detected ({record.issues.length})
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Here is what was detected and why it may be an issue under consumer packaging rules:
            </p>

            <div className="space-y-3 pt-2">
              {record.issues.map((issue, idx) => (
                <div
                  key={issue.id || idx}
                  className="p-4 bg-slate-950 border border-rose-900/40 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-rose-300 text-sm">
                      {issue.title}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-500/30">
                      {issue.ruleRef}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-300">
                    <div>
                      <strong className="text-slate-400">What was detected:</strong> {issue.description}
                    </div>
                    {issue.detectedSnippet && (
                      <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-300">
                        &ldquo;{issue.detectedSnippet}&rdquo;
                      </div>
                    )}
                    <div className="text-emerald-300/90">
                      <strong>Why this matters to you:</strong> {issue.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-emerald-300">
              <strong>All statutory packaging declarations detected correctly!</strong> The label includes MRP (with taxes), standard net quantity, month/year of packing, manufacturer address, and consumer care contact.
            </div>
          </div>
        )}

        {/* Extracted Declarations Cards */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Extracted Packaging Declarations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Information detected from the package label during AI analysis:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {record.declarations.map((field) => {
              const isPassing = field.status === 'PASS';
              const isViolation = field.status === 'POTENTIAL_VIOLATION';
              const isReview = field.status === 'REVIEW';

              return (
                <div
                  key={field.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isPassing
                      ? 'bg-slate-950 border-slate-800'
                      : isViolation
                      ? 'bg-rose-950/20 border-rose-800/40'
                      : 'bg-amber-950/20 border-amber-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">
                      {field.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isPassing
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : isViolation
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {field.detected ? (isPassing ? 'Verified' : 'Flagged') : 'Not Detected'}
                    </span>
                  </div>

                  <div className="text-sm font-medium text-white break-words mt-1">
                    {field.extractedValue || (
                      <span className="text-slate-500 italic text-xs">
                        Not detected on visible label
                      </span>
                    )}
                  </div>

                  {field.notes && (
                    <div className="mt-1.5 text-[11px] text-slate-400">
                      {field.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Consumer Bottom Actions */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onScanAnother}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-850 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
        >
          <Scan className="w-4 h-4" />
          <span>Scan Another Product</span>
        </button>

        <button
          onClick={handleComplaintPrefill}
          className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition-all"
        >
          <Inbox className="w-4 h-4" />
          <span>Raise a Complaint</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Transparency Disclaimer */}
      <div className="text-center text-[11px] text-slate-500 max-w-xl mx-auto space-y-1">
        <p>
          MetraCheck AI Consumer Portal provides preliminary computer vision analysis for consumer awareness under the Legal Metrology (Packaged Commodities) Rules, 2011.
        </p>
        <p>
          Automated findings do not constitute a legal declaration. Official field inspections and enforcement actions are conducted exclusively by authorized government inspectors.
        </p>
      </div>
    </div>
  );
};
