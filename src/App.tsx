import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { LoginScreen } from './components/LoginScreen';
import { DashboardView } from './components/DashboardView';
import { ScanView } from './components/ScanView';
import { InspectionResultView } from './components/InspectionResultView';
import { ReportView } from './components/ReportView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { RulesReferenceModal } from './components/RulesReferenceModal';
import { ModeSelectionScreen } from './components/ModeSelectionScreen';
import { UserHeader, UserNavTab } from './components/user/UserHeader';
import { UserHomeView } from './components/user/UserHomeView';
import { UserAnalysisResultView } from './components/user/UserAnalysisResultView';
import { UserComplaintModal } from './components/user/UserComplaintModal';
import { InspectorComplaintsView } from './components/inspector/InspectorComplaintsView';
import {
  AppMode,
  InspectionRecord,
  InspectorProfile,
  UserComplaint
} from './types';
import {
  getStoredInspections,
  saveInspection,
  deleteInspection,
  resetToDemoData,
  getActiveUser,
  getStoredComplaints,
  updateComplaintStatus
} from './utils/storage';
import { ShieldAlert } from 'lucide-react';

export default function App() {
  // Mode State: 'selection' | 'user' | 'inspector'
  const [appMode, setAppMode] = useState<AppMode>('selection');

  // Inspector Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [inspector, setInspector] = useState<InspectorProfile>(getActiveUser());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Inspections & Complaints Data
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [activeInspection, setActiveInspection] = useState<InspectionRecord | null>(null);
  const [viewingReport, setViewingReport] = useState<boolean>(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(false);
  const [presetToLoad, setPresetToLoad] = useState<'compliant' | 'violation' | 'review' | null>(null);

  // User Mode Specific States
  const [userTab, setUserTab] = useState<UserNavTab>('home');
  const [userActiveInspection, setUserActiveInspection] = useState<InspectionRecord | null>(null);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState<boolean>(false);
  const [complaintPrefill, setComplaintPrefill] = useState<any>(null);

  // Inspector Complaint-to-Inspection flow state
  const [scanPrefilledImage, setScanPrefilledImage] = useState<string | null>(null);
  const [scanPrefilledProductName, setScanPrefilledProductName] = useState<string>('');
  const [scanComplaintSourceId, setScanComplaintSourceId] = useState<string | undefined>(undefined);

  // Initialize data from local storage
  useEffect(() => {
    setInspections(getStoredInspections());
    setComplaints(getStoredComplaints());
  }, []);

  const refreshComplaints = () => {
    setComplaints(getStoredComplaints());
  };

  // Switch Mode handler
  const handleSwitchMode = () => {
    setActiveInspection(null);
    setViewingReport(false);
    setUserActiveInspection(null);
    setAppMode('selection');
  };

  // Inspector Login Handlers
  const handleLogin = (customProfile?: Partial<InspectorProfile>) => {
    if (customProfile) {
      setInspector((prev) => ({ ...prev, ...customProfile }));
    }
    setIsLoggedIn(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveInspection(null);
    setViewingReport(false);
  };

  // Inspector Scan & Demo Preset Handlers
  const handleScanNew = () => {
    setActiveInspection(null);
    setViewingReport(false);
    setPresetToLoad(null);
    setScanPrefilledImage(null);
    setScanPrefilledProductName('');
    setScanComplaintSourceId(undefined);
    setCurrentTab('scan');
  };

  const handleLaunchDemoPreset = (preset: 'compliant' | 'violation' | 'review') => {
    setActiveInspection(null);
    setViewingReport(false);
    setPresetToLoad(preset);
    setScanPrefilledImage(null);
    setScanPrefilledProductName('');
    setScanComplaintSourceId(undefined);
    setCurrentTab('scan');
  };

  // Flow: Launch Inspection from a Citizen Complaint (Inspector Mode)
  const handleStartInspectionFromComplaint = (complaint: UserComplaint) => {
    setActiveInspection(null);
    setViewingReport(false);
    setPresetToLoad(null);
    setScanPrefilledImage(complaint.evidenceImage || null);
    setScanPrefilledProductName(complaint.productName);
    setScanComplaintSourceId(complaint.id);

    // Update complaint status to INSPECTION_REQUIRED if it was NEW
    if (complaint.status === 'NEW') {
      updateComplaintStatus(complaint.id, 'INSPECTION_REQUIRED', 'Inspection initiated by officer via MetraCheck AI.');
      refreshComplaints();
    }

    setCurrentTab('scan');
  };

  const handleAnalysisComplete = (record: InspectionRecord) => {
    saveInspection(record);
    const updated = getStoredInspections();
    setInspections(updated);

    // If this inspection originated from a complaint, update the complaint status and link
    if (record.complaintId) {
      updateComplaintStatus(
        record.complaintId,
        'RESOLVED',
        `Physical inspection completed. Report reference: ${record.id} (${record.overallStatus})`
      );
      refreshComplaints();
    }

    if (appMode === 'user') {
      setUserActiveInspection(record);
      setUserTab('analysis');
    } else {
      setActiveInspection(record);
      setViewingReport(false);
    }
  };

  const handleSelectInspection = (record: InspectionRecord) => {
    setActiveInspection(record);
    setViewingReport(false);
  };

  const handleGenerateReport = (record: InspectionRecord) => {
    setActiveInspection(record);
    setViewingReport(true);
  };

  const handleUpdateRecord = (record: InspectionRecord) => {
    saveInspection(record);
    setInspections(getStoredInspections());
    setActiveInspection(record);
  };

  const handleDeleteInspection = (id: string) => {
    deleteInspection(id);
    const updated = getStoredInspections();
    setInspections(updated);
    if (activeInspection && activeInspection.id === id) {
      setActiveInspection(null);
      setViewingReport(false);
    }
  };

  const handleResetDemo = () => {
    resetToDemoData();
    setInspections(getStoredInspections());
    setComplaints(getStoredComplaints());
    setActiveInspection(null);
    setUserActiveInspection(null);
    setViewingReport(false);
  };

  // User Mode Navigation Handlers
  const handleUserScanNew = () => {
    setPresetToLoad(null);
    setScanPrefilledImage(null);
    setScanPrefilledProductName('');
    setScanComplaintSourceId(undefined);
    setUserTab('scan');
  };

  const handleUserLaunchDemoPreset = (preset: 'compliant' | 'violation' | 'review') => {
    setPresetToLoad(preset);
    setScanPrefilledImage(null);
    setScanPrefilledProductName('');
    setScanComplaintSourceId(undefined);
    setUserTab('scan');
  };

  const handleOpenComplaintModal = (prefill?: any) => {
    setComplaintPrefill(prefill || null);
    setIsComplaintModalOpen(true);
  };

  // =========================================================================
  // VIEW 1: INITIAL MODE SELECTION SCREEN (Requirement 1 & 2)
  // =========================================================================
  if (appMode === 'selection') {
    return (
      <ModeSelectionScreen
        onSelectMode={(mode) => {
          if (mode === 'user') {
            setAppMode('user');
            setUserTab('home');
          } else {
            setAppMode('inspector');
            setCurrentTab('dashboard');
          }
        }}
        isInspectorAuthenticated={isLoggedIn}
        complaintCount={complaints.length}
      />
    );
  }

  // =========================================================================
  // VIEW 2: USER MODE (Requirements 3, 4, 5, 6, 18, 19)
  // =========================================================================
  if (appMode === 'user') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
        {/* User Mode Header */}
        <UserHeader
          activeTab={userTab}
          onChangeTab={(tab) => {
            if (tab === 'complaints') {
              handleOpenComplaintModal();
            } else {
              setUserTab(tab);
            }
          }}
          onOpenComplaintModal={() => handleOpenComplaintModal()}
          onSwitchMode={handleSwitchMode}
          hasActiveAnalysis={Boolean(userActiveInspection)}
        />

        {/* Consumer Awareness Ribbon */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1.5 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-2">
          <span>Consumer Protection & Awareness under the Legal Metrology (Packaged Commodities) Rules, 2011</span>
        </div>

        {/* User Mode Main Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
          {userTab === 'home' && (
            <UserHomeView
              onScanNew={handleUserScanNew}
              onOpenComplaintModal={handleOpenComplaintModal}
              onLaunchDemoPreset={handleUserLaunchDemoPreset}
            />
          )}

          {userTab === 'scan' && (
            <ScanView
              onAnalysisComplete={handleAnalysisComplete}
              presetToLoad={presetToLoad}
              onClearPreset={() => setPresetToLoad(null)}
              preloadedImage={scanPrefilledImage}
              initialProductName={scanPrefilledProductName}
            />
          )}

          {userTab === 'analysis' && userActiveInspection && (
            <UserAnalysisResultView
              record={userActiveInspection}
              onScanAnother={handleUserScanNew}
              onRaiseComplaint={(prefill) => handleOpenComplaintModal(prefill)}
            />
          )}
        </main>

        {/* User Complaint Modal */}
        <UserComplaintModal
          isOpen={isComplaintModalOpen}
          onClose={() => {
            setIsComplaintModalOpen(false);
            setComplaintPrefill(null);
          }}
          prefilledProduct={complaintPrefill}
          onComplaintSubmitted={(newComplaint) => {
            refreshComplaints();
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: INSPECTOR MODE (Requirements 7, 8, 9, 10, 11, 12, 13, 14, 15)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onBackToModeSelection={handleSwitchMode}
      />
    );
  }

  const newComplaintsCount = complaints.filter((c) => c.status === 'NEW').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Official Government Top App Bar */}
      <Header
        inspector={inspector}
        onOpenRules={() => setIsRulesModalOpen(true)}
        onLogout={handleLogout}
        onSwitchMode={handleSwitchMode}
        activeTab={currentTab}
      />

      {/* Human-in-the-Loop Statutory Notice Ribbon (Prompt Section 19) */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-1.5 text-center text-[11px] text-emerald-300 font-medium flex items-center justify-center gap-2 print:hidden">
        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>
          Enforcement Assistant: AI assists the inspector; it does not replace legal authority under the Legal Metrology Act, 2009.
        </span>
      </div>

      {/* Main Inspector Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24">
        {/* If viewing formal digital report */}
        {viewingReport && activeInspection ? (
          <ReportView
            record={activeInspection}
            onBack={() => setViewingReport(false)}
          />
        ) : activeInspection ? (
          /* If viewing full inspection result */
          <InspectionResultView
            record={activeInspection}
            onGenerateReport={handleGenerateReport}
            onScanAnother={handleScanNew}
            onUpdateRecord={handleUpdateRecord}
          />
        ) : (
          /* Tab navigation views */
          <>
            {currentTab === 'dashboard' && (
              <DashboardView
                inspections={inspections}
                complaints={complaints}
                onScanNew={handleScanNew}
                onSelectInspection={handleSelectInspection}
                onLaunchDemoPreset={handleLaunchDemoPreset}
                onViewComplaints={() => setCurrentTab('complaints')}
                onStartInspectionFromComplaint={handleStartInspectionFromComplaint}
              />
            )}

            {currentTab === 'complaints' && (
              <InspectorComplaintsView
                complaints={complaints}
                onStartInspectionFromComplaint={handleStartInspectionFromComplaint}
                onRefreshComplaints={refreshComplaints}
              />
            )}

            {currentTab === 'scan' && (
              <ScanView
                onAnalysisComplete={handleAnalysisComplete}
                presetToLoad={presetToLoad}
                onClearPreset={() => setPresetToLoad(null)}
                preloadedImage={scanPrefilledImage}
                initialProductName={scanPrefilledProductName}
                complaintSourceId={scanComplaintSourceId}
              />
            )}

            {currentTab === 'history' && (
              <HistoryView
                inspections={inspections}
                onSelectInspection={handleSelectInspection}
                onDeleteInspection={handleDeleteInspection}
                onResetDemoData={handleResetDemo}
              />
            )}

            {currentTab === 'reports' && (
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Inspection Reports Library
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Select an inspected commodity to view, print, or export its formal digital compliance certificate.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspections.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => handleGenerateReport(record)}
                      className="p-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono text-emerald-400 font-bold">
                          {record.id}
                        </div>
                        <h3 className="font-semibold text-slate-100 text-sm truncate group-hover:text-emerald-400">
                          {record.productName}
                        </h3>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Status: {record.overallStatus} • {new Date(record.timestamp).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                      <span className="px-3 py-1.5 text-xs font-semibold bg-slate-800 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-300 rounded-lg transition-colors shrink-0">
                        View Report
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTab === 'profile' && (
              <ProfileView
                inspector={inspector}
                onLogout={handleLogout}
                onResetDemo={handleResetDemo}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile-First Sticky Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onChangeTab={(tab) => {
          setActiveInspection(null);
          setViewingReport(false);
          setCurrentTab(tab);
        }}
        historyCount={inspections.length}
        complaintsCount={newComplaintsCount}
      />

      {/* Statutory Rules Reference Modal */}
      <RulesReferenceModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
