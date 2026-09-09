import React, { useMemo, useState } from 'react';
import { Activity, Search, RefreshCw, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { IssueDetailModal } from '../../components/issues/IssueDetailModal';

const label = value => String(value || '—').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const AdminIssuesPage = () => {
  const { issues, dataLoading, dataError, refreshIssues, liveApi } = useData();
  const [query, setQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);

  const filteredIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return issues;
    return issues.filter(issue => [issue.id, issue.title, issue.description, issue.category, issue.categoryLabel, issue.district, issue.status, issue.priority, issue.submittedBy]
      .some(value => String(value || '').toLowerCase().includes(q)));
  }, [issues, query]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" /> Admin Issue Registry
          </div>
          <h1 className="text-2xl font-bold text-jh-green-950 mt-2">All Reported Issues</h1>
          <p className="text-xs text-jh-earth-600 mt-1">Live issue records pulled from the SamadhanSetu database.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-jh-green-950">{issues.length}</div>
          <div className="text-[10px] uppercase tracking-wider text-jh-earth-500">Total Issues</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-jh-earth-200 shadow-jh-soft p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by issue, category, district, status or priority..." className="w-full pl-9 pr-4 py-2.5 text-xs bg-jh-earth-50 border border-jh-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700/40" />
          </div>
          <button onClick={refreshIssues} disabled={!liveApi || dataLoading} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-jh-green-900 text-white text-xs font-bold disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
        {dataError && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{dataError}</div>}
        {!liveApi && <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">Live API is disabled. Enable live API integration to load database issues.</div>}
      </div>

      <div className="bg-white rounded-2xl border border-jh-earth-200 shadow-jh-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-jh-earth-100 uppercase text-[10px] font-bold text-jh-earth-700">
              <tr><th className="p-3">ID</th><th className="p-3">Issue</th><th className="p-3">Category</th><th className="p-3">District</th><th className="p-3">Status</th><th className="p-3">Priority</th><th className="p-3">Submitted By</th><th className="p-3">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-jh-earth-100">
              {dataLoading ? <tr><td colSpan="8" className="p-10 text-center text-jh-earth-500">Loading issues from database…</td></tr> : filteredIssues.length ? filteredIssues.map(issue => (
                <tr key={issue.id} className="hover:bg-jh-earth-50">
                  <td className="p-3 font-mono text-jh-earth-600">#{issue.id}</td>
                  <td className="p-3 min-w-[220px]"><div className="font-bold text-jh-green-950">{issue.title || 'Untitled issue'}</div><div className="mt-1 text-[10px] text-jh-earth-500 line-clamp-2">{issue.description || 'No description'}</div></td>
                  <td className="p-3">{label(issue.categoryLabel || issue.category)}</td>
                  <td className="p-3">{issue.district || '—'}</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full bg-jh-earth-100 font-semibold">{label(issue.status)}</span></td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold">{label(issue.priority)}</span></td>
                  <td className="p-3">{issue.submittedBy || issue.citizenName || '—'}</td>
                  <td className="p-3"><button onClick={() => setSelectedIssue(issue)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-jh-green-50 text-jh-green-900 font-bold hover:bg-jh-green-100"><Eye className="w-3.5 h-3.5" /> View</button></td>
                </tr>
              )) : <tr><td colSpan="8" className="p-10 text-center text-jh-earth-500">No issues found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {selectedIssue && <IssueDetailModal issue={selectedIssue} isOpen onClose={() => setSelectedIssue(null)} />}
    </div>
  );
};
