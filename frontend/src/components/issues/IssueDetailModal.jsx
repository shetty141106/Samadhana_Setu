import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ROLES } from '../../utils/constants';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { 
  MapPin, 
  Calendar, 
  User, 
  Phone, 
  School, 
  Building, 
  Coins, 
  CheckCircle2, 
  Clock, 
  Send, 
  Wrench, 
  CheckCheck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const IssueDetailModal = ({ issue, isOpen, onClose, onNavigate }) => {
  const { currentRole } = useAuth();
  const { verifyIssue, upvoteIssue, sponsorProject } = useData();

  const [triageStatus, setTriageStatus] = useState('VERIFIED');
  const [triagePriority, setTriagePriority] = useState(issue?.priority || 'High');
  const [assignedUniv, setAssignedUniv] = useState('IIT (ISM) Dhanbad');
  const [nodalNote, setNodalNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [sponsorAmount, setSponsorAmount] = useState('500000');
  const [showSponsorSuccess, setShowSponsorSuccess] = useState(false);

  if (!issue) return null;

  const steps = [
    { key: 'SUBMITTED', label: '1. Submitted', icon: Send },
    { key: 'VERIFIED', label: '2. Nodal Verified', icon: ShieldCheck },
    { key: 'IN_RD', label: '3. University R&D', icon: Wrench },
    { key: 'CSR_FUNDED', label: '4. CSR Funded', icon: Coins },
    { key: 'RESOLVED', label: '5. Resolved', icon: CheckCircle2 }
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'SUBMITTED': return 0;
      case 'VERIFIED': return 1;
      case 'IN_RD': return 2;
      case 'CSR_FUNDED': return 3;
      case 'RESOLVED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(issue.status);

  const handleTriageSubmit = () => {
    setIsUpdating(true);
    setTimeout(() => {
      verifyIssue(issue.id, {
        status: triageStatus,
        priority: triagePriority,
        nodalRemarks: nodalNote || `Verified on ground by Nodal Desk. Assigned to ${assignedUniv}.`,
        assignedUniversity: assignedUniv
      });
      setIsUpdating(false);
      onClose();
    }, 500);
  };

  const handleSponsor = () => {
    if (issue.assignedProject) {
      sponsorProject(issue.assignedProject, sponsorAmount, 'Tata Steel Foundation');
    }
    setShowSponsorSuccess(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={issue.title}
      subtitle={`ID: ${issue.id} • ${issue.categoryLabel || issue.category} • ${issue.district}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Step Progress Tracker */}
        <div className="p-4 bg-jh-earth-50 rounded-2xl border border-jh-earth-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-jh-earth-600 mb-3">
            Grievance to Resolution Lifecycle
          </p>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isPast
                      ? 'bg-jh-green-900 text-white'
                      : isCurrent
                      ? 'bg-jh-terracotta-600 text-white ring-4 ring-jh-terracotta-100 animate-pulse'
                      : 'bg-jh-earth-200 text-jh-earth-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-semibold mt-1.5 line-clamp-1 ${
                    isCurrent ? 'text-jh-terracotta-700 font-bold' : isPast ? 'text-jh-green-900' : 'text-jh-earth-500'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Photographic Evidence Gallery */}
        {issue.images && issue.images.length > 0 && (
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-jh-earth-700 mb-2">
              On-Site Photo Evidence
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issue.images.map((img, i) => (
                <div key={i} className="h-48 rounded-xl overflow-hidden border border-jh-earth-200 shadow-xs">
                  <img src={img} alt="Evidence" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issue Details & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="p-4 bg-white rounded-xl border border-jh-earth-200 space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">
              Grievance Meta
            </h5>
            <div className="text-xs space-y-1.5 text-jh-earth-800">
              <div className="flex items-center justify-between">
                <span className="text-jh-earth-600">Current Status:</span>
                <StatusBadge status={issue.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-jh-earth-600">Priority Level:</span>
                <span className="font-bold text-jh-terracotta-700">{issue.priority}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-jh-earth-600">Reported On:</span>
                <span>{issue.reportedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-jh-earth-600">Submitted By:</span>
                <span className="font-semibold">{issue.submittedBy}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-jh-earth-200 space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">
              Location & Jurisdiction
            </h5>
            <div className="text-xs space-y-1.5 text-jh-earth-800">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-jh-terracotta-600" />
                <span className="font-medium">{issue.locationName}</span>
              </div>
              <p className="text-jh-earth-600 pl-6">
                District: <strong className="text-jh-charcoal">{issue.district}</strong>
              </p>
              {issue.coordinates && (
                <p className="text-jh-earth-500 text-[11px] pl-6 font-mono">
                  GPS: {issue.coordinates.lat.toFixed(4)}° N, {issue.coordinates.lng.toFixed(4)}° E
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Description */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-jh-earth-700 mb-1.5">
            Ground Truth Description
          </h5>
          <p className="text-xs text-jh-charcoal leading-relaxed bg-jh-earth-50/60 p-4 rounded-xl border border-jh-earth-200">
            {issue.description}
          </p>
        </div>

        {/* Nodal Officer Remarks / University Assignment */}
        {issue.nodalRemarks && (
          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>District Nodal Officer Field Assessment</span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed">
              {issue.nodalRemarks}
            </p>
            {issue.assignedUniversity && (
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-jh-green-900">
                <School className="w-4 h-4 text-jh-green-700" />
                <span>Assigned Academic Center: {issue.assignedUniversity}</span>
              </div>
            )}
          </div>
        )}

        {/* Timeline Log */}
        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-jh-earth-700 mb-2">
            Audit Timeline Log
          </h5>
          <div className="space-y-2">
            {issue.timeline && issue.timeline.map((t, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs bg-white p-2.5 rounded-lg border border-jh-earth-100">
                <div className="w-2 h-2 rounded-full bg-jh-green-800 mt-1.5"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-jh-green-950">{t.status}</span>
                    <span className="text-[10px] text-jh-earth-500">{t.date}</span>
                  </div>
                  <p className="text-jh-earth-700 mt-0.5">{t.remark}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Persona Specific Action Banners */}
        {currentRole === ROLES.NODAL && (
          <div className="p-4 bg-jh-green-50 rounded-2xl border border-jh-green-300 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-jh-green-950">
              <ShieldCheck className="w-4 h-4 text-jh-green-800" />
              <span>Nodal Officer Verification & Assignment Desk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-jh-green-900 mb-1">Update Status</label>
                <select
                  value={triageStatus}
                  onChange={(e) => setTriageStatus(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-jh-green-300 rounded-lg"
                >
                  <option value="VERIFIED">Verify & Approve for Solution</option>
                  <option value="IN_RD">Direct Assign to University R&D</option>
                  <option value="RESOLVED">Mark Resolved on Ground</option>
                  <option value="REJECTED">Reject / Duplicate</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-jh-green-900 mb-1">Assign University / Center</label>
                <select
                  value={assignedUniv}
                  onChange={(e) => setAssignedUniv(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-jh-green-300 rounded-lg"
                >
                  <option value="IIT (ISM) Dhanbad">IIT (ISM) Dhanbad (Mining & Water)</option>
                  <option value="BIT Mesra">BIT Mesra (Civil & Cleantech)</option>
                  <option value="NIT Jamshedpur">NIT Jamshedpur (Solar & Microgrids)</option>
                  <option value="Birsa Agricultural University">Birsa Agricultural University (Forest & Agri)</option>
                  <option value="Ranchi University">Ranchi University (Tribal Tech)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-jh-green-900 mb-1">Inspection Remarks & Instructions</label>
              <textarea
                rows={2}
                placeholder="Add verification notes, severity observations, and specific academic tasks..."
                value={nodalNote}
                onChange={(e) => setNodalNote(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-jh-green-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleTriageSubmit}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating Record...' : 'Confirm Verification & Update'}
              </Button>
            </div>
          </div>
        )}

        {currentRole === ROLES.INDUSTRY && issue.assignedProject && (
          <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
              <Coins className="w-4 h-4 text-orange-700" />
              <span>Corporate CSR Sponsorship Pledge</span>
            </div>
            <p className="text-xs text-orange-800">
              This issue has an active university R&D prototype ready for ground deployment. Funding required: <strong>{issue.fundingRequired || '₹ 5,00,000'}</strong>
            </p>
            {showSponsorSuccess ? (
              <div className="p-3 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg text-center">
                ✓ CSR Pledge of ₹{(Number(sponsorAmount)/100000).toFixed(2)} Lakh Confirmed! Transferred to University Escrow.
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={sponsorAmount}
                  onChange={(e) => setSponsorAmount(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-orange-300 rounded-lg font-mono font-bold"
                  placeholder="Amount in ₹"
                />
                <Button variant="secondary" size="sm" onClick={handleSponsor}>
                  Pledge CSR Grant
                </Button>
              </div>
            )}
          </div>
        )}

      </div>
    </Modal>
  );
};
