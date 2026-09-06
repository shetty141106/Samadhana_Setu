import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { IssueCard } from '../../components/issues/IssueCard';
import { IssueMap } from '../../components/maps/IssueMap';
import { IssueForm } from '../../components/issues/IssueForm';
import { IssueDetailModal } from '../../components/issues/IssueDetailModal';
import { Button } from '../../components/ui/Button';
import { 
  FilePlus2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Sparkles, 
  Award, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const CitizenDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { issues, upvoteIssue } = useData();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const myIssues = issues.filter(i => i.submittedBy.includes(currentUser.name) || i.district === currentUser.district);
  const resolvedCount = issues.filter(i => i.status === 'RESOLVED').length;
  const inRdCount = issues.filter(i => i.status === 'IN_RD' || i.status === 'CSR_FUNDED').length;

  const filteredIssues = issues.filter(i => {
    if (filterCategory === 'all') return true;
    return i.category === filterCategory;
  });

  // If sub-view requested via sidebar
  if (currentPath === 'report-issue') {
    return (
      <div className="max-w-3xl mx-auto py-2">
        <IssueForm
          onSuccess={() => onNavigate('my-issues')}
          onCancel={() => onNavigate('citizen')}
        />
      </div>
    );
  }

  if (currentPath === 'issue-map') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-jh-green-950">Jharkhand State GIS Issue Map</h2>
            <p className="text-xs text-jh-earth-600">Explore reported environmental and civic complaints across all 24 districts</p>
          </div>
          <Button variant="primary" size="sm" icon={FilePlus2} onClick={() => onNavigate('report-issue')}>
            Report New Issue
          </Button>
        </div>
        <IssueMap issues={issues} onSelectIssue={(iss) => setSelectedIssue(iss)} height="600px" />
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
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-jh-green-900 to-jh-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-jh-gold-400 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Citizen Action Portal • {currentUser.district}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
            Johar, {currentUser.name}!
          </h1>
          <p className="text-xs sm:text-sm text-jh-earth-200 max-w-xl">
            Your contributions help district nodal teams and university researchers restore Jharkhand's water bodies, forests, and civic infrastructure.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            size="lg"
            icon={FilePlus2}
            onClick={() => onNavigate('report-issue')}
            className="shadow-md"
          >
            Report an Issue
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="My Submissions"
          value={myIssues.length}
          subtitle="Issues logged in my district"
          icon={FilePlus2}
          color="forest"
        />
        <StatCard
          title="In University R&D"
          value={inRdCount}
          subtitle="Active student/lab solutions"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Resolved on Ground"
          value={resolvedCount}
          subtitle="Ecological restoration complete"
          icon={CheckCircle2}
          color="terracotta"
        />
        <StatCard
          title="Citizen Trust Score"
          value={`${currentUser.reputationPoints || 480} pts`}
          subtitle="Top 5% active contributor"
          icon={Award}
          color="gold"
        />
      </div>

      {/* Main Grid: Live Map + Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Community Issues (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-jh-green-950">
                Active Community Grievances & Restorations
              </h3>
              <p className="text-xs text-jh-earth-600">Track real-time progress across Jharkhand</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-jh-earth-200 text-xs">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'all' ? 'bg-jh-green-900 text-white font-bold' : 'text-jh-earth-700 hover:bg-jh-earth-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCategory('water')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'water' ? 'bg-jh-green-900 text-white font-bold' : 'text-jh-earth-700 hover:bg-jh-earth-100'
                }`}
              >
                Water
              </button>
              <button
                onClick={() => setFilterCategory('forest')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'forest' ? 'bg-jh-green-900 text-white font-bold' : 'text-jh-earth-700 hover:bg-jh-earth-100'
                }`}
              >
                Forest
              </button>
              <button
                onClick={() => setFilterCategory('mining')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  filterCategory === 'mining' ? 'bg-jh-green-900 text-white font-bold' : 'text-jh-earth-700 hover:bg-jh-earth-100'
                }`}
              >
                Mining
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIssues.slice(0, 4).map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onSelect={(iss) => setSelectedIssue(iss)}
                onUpvote={(id) => upvoteIssue(id)}
              />
            ))}
          </div>

        </div>

        {/* Right Column: Mini Interactive Map & Nearby Alerts (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-jh-green-950">
              Nearby District View
            </h3>
            <button
              onClick={() => onNavigate('issue-map')}
              className="text-xs font-bold text-jh-terracotta-700 hover:underline flex items-center gap-1"
            >
              <span>Full Screen</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <IssueMap
            issues={issues}
            selectedDistrict={currentUser.district}
            height="320px"
            onSelectIssue={(iss) => setSelectedIssue(iss)}
          />

          {/* How Citizen Reporting Works Card */}
          <div className="bg-jh-earth-100/70 rounded-2xl p-4 border border-jh-earth-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-jh-green-950">
              <Sparkles className="w-4 h-4 text-jh-terracotta-600" />
              <span>Grievance Escalation Protocol</span>
            </div>
            <p className="text-jh-earth-700 leading-relaxed text-[11px]">
              Every citizen submission is verified on ground within 48 hours by the District Nodal Officer before routing to university R&D centers.
            </p>
          </div>

        </div>

      </div>

      {/* Modal for Issue Details */}
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
