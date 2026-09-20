import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Building2,
  DollarSign,
  Calendar,
  ShieldCheck,
  Phone,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import { ComplaintType, UserComplaint } from '../../types';
import { generateComplaintId, saveComplaint } from '../../utils/storage';

interface UserComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledProduct?: {
    productName?: string;
    brand?: string;
    category?: string;
    evidenceImage?: string;
    description?: string;
    complaintType?: ComplaintType;
  };
  onComplaintSubmitted?: (complaint: UserComplaint) => void;
}

export const UserComplaintModal: React.FC<UserComplaintModalProps> = ({
  isOpen,
  onClose,
  prefilledProduct,
  onComplaintSubmitted
}) => {
  const [productName, setProductName] = useState<string>(prefilledProduct?.productName || '');
  const [brand, setBrand] = useState<string>(prefilledProduct?.brand || '');
  const [category, setCategory] = useState<string>(prefilledProduct?.category || 'Food & Beverages');
  const [complaintType, setComplaintType] = useState<ComplaintType>(
    prefilledProduct?.complaintType || 'Missing declaration'
  );
  const [description, setDescription] = useState<string>(prefilledProduct?.description || '');
  const [evidenceImage, setEvidenceImage] = useState<string | null>(prefilledProduct?.evidenceImage || null);
  const [storeName, setStoreName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [printedMrp, setPrintedMrp] = useState<string>('');
  const [chargedPrice, setChargedPrice] = useState<string>('');
  const [batchNo, setBatchNo] = useState<string>('');
  const [consumerName, setConsumerName] = useState<string>('');
  const [consumerContact, setConsumerContact] = useState<string>('');

  // Form submission state
  const [submittedComplaint, setSubmittedComplaint] = useState<UserComplaint | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEvidenceImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!productName.trim()) {
      setErrorMsg('Please specify the product name.');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please provide a brief description of the issue.');
      return;
    }

    const complaintId = generateComplaintId();
    const newComplaint: UserComplaint = {
      id: complaintId,
      timestamp: new Date().toISOString(),
      productName: productName.trim(),
      brand: brand.trim() || undefined,
      category,
      complaintType,
      description: description.trim(),
      evidenceImage: evidenceImage || undefined,
      storeName: storeName.trim() || undefined,
      location: location.trim() || undefined,
      printedMrp: printedMrp.trim() || undefined,
      chargedPrice: chargedPrice.trim() || undefined,
      batchNo: batchNo.trim() || undefined,
      consumerName: consumerName.trim() || undefined,
      consumerContact: consumerContact.trim() || undefined,
      status: 'NEW',
      priority: 'HIGH',
      isDemo: true
    };

    saveComplaint(newComplaint);
    setSubmittedComplaint(newComplaint);

    if (onComplaintSubmitted) {
      onComplaintSubmitted(newComplaint);
    }
  };

  const handleCopyId = () => {
    if (submittedComplaint) {
      navigator.clipboard.writeText(submittedComplaint.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedComplaint(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Raise a Product Compliance Grievance
              </h2>
              <p className="text-xs text-slate-400">
                Report non-compliant packaging, overpricing, or missing declarations
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {submittedComplaint ? (
            /* Success View */
            <div className="py-6 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                  Complaint Recorded
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Complaint Submitted Successfully
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Your consumer grievance has been registered and assigned a unique tracking reference.
                </p>
              </div>

              {/* Reference ID card */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-w-md mx-auto text-left">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Complaint Reference ID
                </div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
                    {submittedComplaint.id}
                  </span>
                  <button
                    onClick={handleCopyId}
                    className="px-2.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <div><strong className="text-slate-300">Product:</strong> {submittedComplaint.productName}</div>
                  <div><strong className="text-slate-300">Issue:</strong> {submittedComplaint.complaintType}</div>
                  <div><strong className="text-slate-300">Date:</strong> {new Date(submittedComplaint.timestamp).toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Statutory / Platform Notice */}
              <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 max-w-md mx-auto text-left flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-slate-300">Demo System Notice:</strong> Complaint recorded in MetraCheck demo system. Authorized Legal Metrology inspectors can review this complaint directly inside Inspector Mode to initiate an official audit.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-950/40"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Complaint Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Product Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Crispy Delights Cookies 200g"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Brand / Manufacturer (Optional)
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Golden Treats Foods Ltd."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Category & Complaint Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Product Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Personal Care & Cosmetics">Personal Care & Cosmetics</option>
                    <option value="Household & Cleaning">Household & Cleaning</option>
                    <option value="Electronics & Appliances">Electronics & Appliances</option>
                    <option value="Pharmaceuticals/Health">Pharmaceuticals & Health Supplements</option>
                    <option value="General Retail">General Retail & Commodities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Complaint Type <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value as ComplaintType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
                  >
                    <option value="Incorrect MRP">Incorrect MRP / Overcharging / Sticker</option>
                    <option value="Incorrect / unclear quantity">Incorrect / Unclear Net Quantity</option>
                    <option value="Missing declaration">Missing Mandatory Declarations</option>
                    <option value="Manufacturer / packer / importer issue">Manufacturer / Packer Address Missing</option>
                    <option value="Date declaration issue">Date of Manufacture / Packing Missing</option>
                    <option value="Consumer care information issue">Consumer Care Helpline Missing or Blurred</option>
                    <option value="Packaging / label issue">Packaging / Font Height / Readability Issue</option>
                    <option value="Other">Other Statutory Issue</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description of Issue <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what is wrong with the package label, what was charged, or which mandatory declaration is missing..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Upload Product / Evidence */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Upload Product / Label Evidence (Photo)
                </label>
                {evidenceImage ? (
                  <div className="relative rounded-xl border border-slate-700 overflow-hidden bg-slate-950 p-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={evidenceImage}
                        alt="Evidence Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-slate-800"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-emerald-400 block">Evidence Photo Attached</span>
                        <span className="text-slate-500">Packaging label image</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEvidenceImage(null)}
                      className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 bg-rose-950/50 border border-rose-900/50 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-300">
                      Click to upload label photo or drag & drop
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      JPG, PNG, WebP up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Optional Store & Price Details */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Optional Purchase / Retail Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Retailer / Store Name (e.g. Supermart)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City / Area (e.g. Karol Bagh, Delhi)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={printedMrp}
                      onChange={(e) => setPrintedMrp(e.target.value)}
                      placeholder="Printed MRP (e.g. ₹40)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={chargedPrice}
                      onChange={(e) => setChargedPrice(e.target.value)}
                      placeholder="Charged Price (e.g. ₹45)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      placeholder="Batch / Lot No."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Optional Contact */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Optional Contact (No account required)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={consumerName}
                      onChange={(e) => setConsumerName(e.target.value)}
                      placeholder="Your Name (Optional)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={consumerContact}
                      onChange={(e) => setConsumerContact(e.target.value)}
                      placeholder="Phone or Email (Optional)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>
                </div>
              </div>

              {/* Credibility Notice */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Platform Transparency:</span> Complaint recorded in MetraCheck demo system. Submissions are saved locally and made visible to the Inspector workspace for demonstration under the Legal Metrology Act, 2009.
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-rose-950/40"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
