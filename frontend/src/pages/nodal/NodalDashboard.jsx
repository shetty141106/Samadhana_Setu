import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { IssueCard } from '../../components/issues/IssueCard';
import { IssueMap } from '../../components/maps/IssueMap';
import { IssueDetailModal } from '../../components/issues/IssueDetailModal';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  School, 
  Eye, 
  Filter, 
  CheckCheck,
  AlertTriangle
} from 'lucide-react';

export const NodalDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { issues } = useData();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified' | 'all'

  const pendingIssues = issues.filter(i => i.status === 'SUBMITTED');
  const verifiedIssues = issues.filter(i => i.status !== 'SUBMITTED' && i.status !== 'REJECTED');
  const criticalCount = issues.filter(i => i.priority === 'Critical').length;

  if (currentPath === 'area-map') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-jh-green-950">
              District Nodal Field Verification GIS Map
            </h2>
            <p className="text-xs text-jh-earth-600">
              Jurisdiction: {currentUser.district || 'East Singhbhum (Jamshedpur)'}
            </p>
          </div>
        </div>
        <IssueMap issues={issues} onSelectIssue={(iss) => setSelectedIssue(iss)} height="620px" />
        {selectedIssue && (
          <IssueDetailModal
            issue={selectedIssue}
            isOpen={!!selectedIssue}
            onClose={() => setSelectedIssue(null)}
            onNavigate={onNavigate}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>District Nodal Verification Desk • {currentUser.district}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950">
            {currentUser.name}
          </h1>
          <p className="text-xs text-jh-earth-600 max-w-xl">
            {currentUser.department || 'Department of Forest, Environment & Climate Change'} — Inspect citizen complaints, assign technical priorities, and route cases to academic labs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={MapPin}
            onClick={() => onNavigate('area-map')}
          >
            District GIS Map
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Awaiting Verification"
          value={pendingIssues.length}
          subtitle="Requires field inspection"
          icon={Clock}
          color="terracotta"
        />
        <StatCard
          title="Critical Severity"
          value={criticalCount}
          subtitle="High-impact priority cases"
          icon={AlertTriangle}
          color="gold"
        />
        <StatCard
          title="Routed to Universities"
          value={issues.filter(i => i.status === 'IN_RD').length}
          subtitle="R&D prototypes active"
          icon={School}
          color="forest"
        />
        <StatCard
          title="Resolved Cases"
          value={issues.filter(i => i.status === 'RESOLVED').length}
          subtitle="Interventions commissioned"
          icon={CheckCircle2}
          color="blue"
        />
      </div>

      {/* Verification Queue & Table */}
      <div className="bg-white rounded-2xl border border-jh-earth-200 shadow-jh-soft overflow-hidden">
        
        {/* Table Top Controls */}
        <div className="p-4 bg-jh-earth-50 border-b border-jh-earth-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-jh-green-900 text-white shadow-xs'
                  : 'text-jh-earth-700 hover:bg-jh-earth-200'
              }`}
            >
              Pending Verification ({pendingIssues.length})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'verified'
                  ? 'bg-jh-green-900 text-white shadow-xs'
                  : 'text-jh-earth-700 hover:bg-jh-earth-200'
              }`}
            >
              Active / In R&D ({verifiedIssues.length})
            </button>
          </div>

          <span className="text-xs text-jh-earth-600 font-medium">
            Click any row to open the verification and university assignment modal
          </span>
        </div>

        {/* Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-jh-earth-100/70 text-jh-earth-800 uppercase font-bold text-[10px] tracking-wider border-b border-jh-earth-200">
              <tr>
                <th className="px-4 py-3">Case ID & Date</th>
                <th className="px-4 py-3">Issue Title</th>
                <th className="px-4 py-3">Location & District</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Triage Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jh-earth-100 font-sans">
              {(activeTab === 'pending' ? pendingIssues : verifiedIssues).map((issue) => (
                <tr
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  className="hover:bg-jh-green-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-mono font-bold text-jh-green-900">{issue.id}</span>
                    <div className="text-[10.5px] text-jh-earth-500">{issue.reportedDate}</div>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs font-bold text-jh-charcoal">
                    <div className="line-clamp-1">{issue.title}</div>
                    <div className="text-[11px] font-normal text-jh-earth-600 line-clamp-1">{issue.description}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-jh-earth-800">
                    <div className="font-semibold">{issue.district}</div>
                    <div className="text-[10.5px] text-jh-earth-500 truncate max-w-[150px]">{issue.locationName}</div>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-jh-earth-900">{issue.categoryLabel || issue.category}</span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      issue.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <Button variant="primary" size="sm" icon={Eye}>
                      Verify Case
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal for Verification Triage */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onNavigate={onNavigate}
        />
      )}

    </div>
  );
};
