/**
 * Local storage manager for inspection records and officer preferences
 */

import { InspectionRecord, UserComplaint, ComplaintStatus } from '../types';
import { SAMPLE_INSPECTIONS, SAMPLE_COMPLAINTS } from '../data/demoData';

const STORAGE_KEY = 'metracheck_inspections_v1';
const COMPLAINTS_KEY = 'metracheck_complaints_v1';
const USER_KEY = 'metracheck_active_user_v1';

export function getStoredInspections(): InspectionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Initialize with realistic demo records
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INSPECTIONS));
      return SAMPLE_INSPECTIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read inspections from storage:', err);
    return SAMPLE_INSPECTIONS;
  }
}

export function saveInspection(record: InspectionRecord): void {
  try {
    const existing = getStoredInspections();
    const index = existing.findIndex(r => r.id === record.id);
    let updated: InspectionRecord[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = record;
    } else {
      updated = [record, ...existing];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save inspection:', err);
  }
}

export function deleteInspection(id: string): void {
  try {
    const existing = getStoredInspections();
    const updated = existing.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete inspection:', err);
  }
}

export function resetToDemoData(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_INSPECTIONS));
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SAMPLE_COMPLAINTS));
  } catch (err) {
    console.error('Failed to reset inspections:', err);
  }
}

export function getStoredComplaints(): UserComplaint[] {
  try {
    const raw = localStorage.getItem(COMPLAINTS_KEY);
    if (!raw) {
      localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(SAMPLE_COMPLAINTS));
      return SAMPLE_COMPLAINTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read complaints from storage:', err);
    return SAMPLE_COMPLAINTS;
  }
}

export function saveComplaint(complaint: UserComplaint): void {
  try {
    const existing = getStoredComplaints();
    const index = existing.findIndex(c => c.id === complaint.id);
    let updated: UserComplaint[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = complaint;
    } else {
      updated = [complaint, ...existing];
    }
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save complaint:', err);
  }
}

export function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
  inspectorNotes?: string,
  linkedInspectionId?: string
): void {
  try {
    const existing = getStoredComplaints();
    const updated = existing.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status,
          ...(inspectorNotes !== undefined ? { inspectorNotes } : {}),
          ...(linkedInspectionId !== undefined ? { linkedInspectionId } : {})
        };
      }
      return c;
    });
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update complaint status:', err);
  }
}

export function deleteComplaint(id: string): void {
  try {
    const existing = getStoredComplaints();
    const updated = existing.filter(c => c.id !== id);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete complaint:', err);
  }
}

export function generateComplaintId(): string {
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `MC-CMP-2026-${randomDigits}`;
}

export function getActiveUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {}
  return {
    name: 'Insp. Rajesh Sharma',
    badge: 'LMD-DL-4091',
    designation: 'Senior Legal Metrology Officer',
    department: 'Department of Consumer Affairs, Legal Metrology Wing',
    jurisdiction: 'Zone 4, New Delhi Central',
    email: 'r.sharma@lmd.gov.in',
    phone: '+91 98110 44921'
  };
}
