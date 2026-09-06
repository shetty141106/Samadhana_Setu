import React from 'react';
import { ISSUE_STATUSES } from '../../utils/constants';
import { CheckCircle2, Clock, Wrench, Coins, XCircle, Send } from 'lucide-react';

export const StatusBadge = ({ status, className = '' }) => {
  const statusInfo = ISSUE_STATUSES[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    step: 0
  };

  const getIcon = () => {
    switch (status) {
      case 'SUBMITTED':
        return <Send className="w-3 h-3 text-gray-600" />;
      case 'VERIFIED':
        return <Clock className="w-3 h-3 text-blue-600" />;
      case 'IN_RD':
        return <Wrench className="w-3 h-3 text-purple-600" />;
      case 'CSR_FUNDED':
        return <Coins className="w-3 h-3 text-amber-600" />;
      case 'RESOLVED':
        return <CheckCircle2 className="w-3 h-3 text-emerald-600" />;
      case 'REJECTED':
        return <XCircle className="w-3 h-3 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color} ${className}`}>
      {getIcon()}
      <span>{statusInfo.label}</span>
    </span>
  );
};
