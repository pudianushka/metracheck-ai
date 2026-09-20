import React, { useState } from 'react';
import {
  Inbox,
  AlertTriangle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  Eye,
  Scan,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  FileText,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Check,
  Tag
} from 'lucide-react';
import { UserComplaint, ComplaintStatus } from '../../types';
import { updateComplaintStatus } from '../../utils/storage';

interface InspectorComplaintsViewProps {
  complaints: UserComplaint[];
  onStartInspectionFromComplaint: (complaint: UserComplaint) => void;
  onRefreshComplaints: () => void;
}

export const InspectorComplaintsView: React.FC<InspectorComplaintsViewProps> = ({
  complaints,
  onStartInspectionFromComplaint,
  onRefreshComplaints
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<UserComplaint | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inspectorNotesInput, setInspectorNotesInput] = useState<string>('');
  const [saveFeedback, setSaveFeedback] = useState<string>('');

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesSearch =
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.complaintType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.brand && c.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.storeName && c.storeName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            NEW
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            UNDER REVIEW
          </span>
        );
      case 'INSPECTION_REQUIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            INSPECTION REQUIRED
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            RESOLVED
          </span>
        );
    }
  };

  const handleOpenComplaint = (complaint: UserComplaint) => {
    setSelectedComplaint(complaint);
    setInspectorNotesInput(complaint.inspectorNotes || '');
    setSaveFeedback('');
  };

  const handleUpdateStatus = (newStatus: ComplaintStatus) => {
    if (!selectedComplaint) return;
    updateComplaintStatus(selectedComplaint.id, newStatus, inspectorNotesInput);
    setSelectedComplaint({
      ...selectedComplaint,
      status: newStatus,
      inspectorNotes: inspectorNotesInput
    });
    setSaveFeedback(`Status updated to ${newStatus}`);
    setTimeout(() => setSaveFeedback(''), 2500);
    onRefreshComplaints();
  };

  const handleSaveNotesOnly = () => {
    if (!selectedComplaint) return;
    updateComplaintStatus(selectedComplaint.id, selectedComplaint.status, inspectorNotesInput);
    setSelectedComplaint({
      ...selectedComplaint,
      inspectorNotes: inspectorNotesInput
    });
    setSaveFeedback('Inspector notes saved');
    setTimeout(() => setSaveFeedback(''), 2500);
    onRefreshComplaints();
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Citizen Grievance & Complaint Center
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
              Grievance Desk
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consumer complaints submitted through the MetraCheck User Portal. Review grievances, investigate packaging evidence, and launch on-site statutory inspections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right text-xs text-slate-400">
            <span className="font-bold text-white text-base block">{complaints.length}</span>
            <span>Total Logged</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Product Name, ID, Store, or Issue..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['ALL', 'NEW', 'UNDER_REVIEW', 'INSPECTION_REQUIRED', 'RESOLVED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === status
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800/60'
              }`}
            >
              {status === 'ALL' ? 'All Complaints' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Complaints List / Grid */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-slate-300">
              No complaints match the selected filter
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Any complaint raised in User Mode will automatically show up here for inspector review and action.
            </p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => {
            const dateStr = new Date(complaint.timestamp).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={complaint.id}
                onClick={() => handleOpenComplaint(complaint)}
                className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer group shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Evidence / Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                    {complaint.evidenceImage ? (
                      <img
                        src={complaint.evidenceImage}
                        alt={complaint.productName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-400/80" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-300">
                        {complaint.id}
                      </span>
                      <span className="text-slate-600 text-xs">•</span>
                      <span className="text-xs text-rose-300 font-semibold">
                        {complaint.complaintType}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate group-hover:text-emerald-400 transition-colors">
                      {complaint.productName}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      {complaint.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span>Logged: {dateStr}</span>
                      {complaint.storeName && (
                        <>
                          <span>•</span>
                          <span>Store: {complaint.storeName}</span>
                        </>
                      )}
                      {complaint.linkedInspectionId && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            Inspection: {complaint.linkedInspectionId}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div>{getStatusBadge(complaint.status)}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenComplaint(complaint);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>View Grievance</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* COMPLAINT DETAIL MODAL / DRAWER */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Inbox className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white">
                      {selectedComplaint.id}
                    </span>
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Citizen Complaint Record • Logged {new Date(selectedComplaint.timestamp).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
              {saveFeedback && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{saveFeedback}</span>
                </div>
              )}

              {/* CRITICAL ACTION BAR: Connect Complaint -> Inspection */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Statutory Inspection Action</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Launch automated AI verification using the product evidence from this grievance:
                  </p>
                </div>

                <button
                  onClick={() => {
                    const complaintCopy = { ...selectedComplaint };
                    setSelectedComplaint(null);
                    onStartInspectionFromComplaint(complaintCopy);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shrink-0"
                >
                  <Scan className="w-4 h-4 stroke-[2.5]" />
                  <span>Start Inspection</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Product Info & Evidence */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Evidence Image */}
                <div className="md:col-span-1 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 block w-full text-left">
                    Attached Evidence Photo
                  </span>
                  {selectedComplaint.evidenceImage ? (
                    <img
                      src={selectedComplaint.evidenceImage}
                      alt={selectedComplaint.productName}
                      className="max-h-52 w-auto object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="py-12 text-center text-slate-500">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span>No image attached</span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="md:col-span-2 space-y-3">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Product Details
                    </span>
                    <div className="text-sm font-bold text-white">
                      {selectedComplaint.productName}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-300 pt-1">
                      <div>
                        <strong className="text-slate-500 block text-[10px]">BRAND</strong>
                        {selectedComplaint.brand || 'Not Specified'}
                      </div>
                      <div>
                        <strong className="text-slate-500 block text-[10px]">CATEGORY</strong>
                        {selectedComplaint.category}
                      </div>
                      <div>
                        <strong className="text-slate-500 block text-[10px]">GRIEVANCE TYPE</strong>
                        <span className="text-rose-300 font-semibold">
                          {selectedComplaint.complaintType}
                        </span>
                      </div>
                      <div>
                        <strong className="text-slate-500 block text-[10px]">PRIORITY</strong>
                        <span className="text-amber-300 font-semibold">
                          {selectedComplaint.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Retail / Purchase Details */}
                  {(selectedComplaint.storeName || selectedComplaint.location || selectedComplaint.printedMrp) && (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-slate-300">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Retail Purchase Information
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedComplaint.storeName && (
                          <div>
                            <strong className="text-slate-500 block text-[10px]">RETAILER</strong>
                            {selectedComplaint.storeName}
                          </div>
                        )}
                        {selectedComplaint.location && (
                          <div>
                            <strong className="text-slate-500 block text-[10px]">LOCATION</strong>
                            {selectedComplaint.location}
                          </div>
                        )}
                        {selectedComplaint.printedMrp && (
                          <div>
                            <strong className="text-slate-500 block text-[10px]">PRINTED MRP</strong>
                            {selectedComplaint.printedMrp}
                          </div>
                        )}
                        {selectedComplaint.chargedPrice && (
                          <div>
                            <strong className="text-slate-500 block text-[10px]">CHARGED PRICE</strong>
                            <span className="text-rose-400 font-bold">{selectedComplaint.chargedPrice}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Consumer Contact if present */}
                  {(selectedComplaint.consumerName || selectedComplaint.consumerContact) && (
                    <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>
                        Complainant: <strong className="text-slate-200">{selectedComplaint.consumerName || 'Citizen'}</strong>
                        {selectedComplaint.consumerContact && ` (${selectedComplaint.consumerContact})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User-submitted Description */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Consumer Description of Grievance
                </span>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Inspector Review & Notes */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Officer Case Notes & Directions
                  </span>
                  <button
                    onClick={handleSaveNotesOnly}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={inspectorNotesInput}
                  onChange={(e) => setInspectorNotesInput(e.target.value)}
                  placeholder="Record preliminary case notes, directions to local inspection team, or reference numbers..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500"
                />

                {/* Status Toggle Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-slate-400 mr-2">Set Status:</span>
                  <button
                    onClick={() => handleUpdateStatus('UNDER_REVIEW')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedComplaint.status === 'UNDER_REVIEW'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('INSPECTION_REQUIRED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedComplaint.status === 'INSPECTION_REQUIRED'
                        ? 'bg-purple-950 text-purple-300 border border-purple-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Flag Inspection Required
                  </button>
                  <button
                    onClick={() => handleUpdateStatus('RESOLVED')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      selectedComplaint.status === 'RESOLVED'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Resolve Complaint
                  </button>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-[11px] text-slate-500 text-center">
                Demo grievance environment under Legal Metrology Act, 2009. Actions recorded locally for demonstration.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
