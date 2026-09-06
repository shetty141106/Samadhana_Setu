import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { IssueMap } from '../../components/maps/IssueMap';
import { MOCK_USERS } from '../../data/mockData';
import { dashboardApi } from '../../api/dashboard.api';
import { 
  ShieldCheck, 
  Activity, 
  Globe2, 
  School, 
  Building
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const FALLBACK_DOMAIN_DATA = [
  { name: 'Water', issues: 18 },
  { name: 'Mining', issues: 24 },
  { name: 'Forest', issues: 14 },
  { name: 'Solar', issues: 11 },
  { name: 'Civic', issues: 9 },
  { name: 'AgriTech', issues: 10 }
];

const FALLBACK_STATUS_DATA = [
  { name: 'Resolved', value: 35 },
  { name: 'In University R&D', value: 28 },
  { name: 'CSR Funded', value: 20 },
  { name: 'Under Nodal Verification', value: 17 }
];

const formatLabel = value => String(value || '')
  .toLowerCase()
  .replace(/_/g, ' ')
  .replace(/\b\w/g, char => char.toUpperCase());

export const AdminDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { issues, stats, dashboard, liveApi } = useData();
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [analytics, setAnalytics] = useState({ categories: null, statuses: null });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (!liveApi) return;
    let cancelled = false;
    setAnalyticsLoading(true);
    Promise.allSettled([
      dashboardApi.getIssueCategories(),
      dashboardApi.getIssueStatus()
    ]).then(([categoriesResult, statusesResult]) => {
      if (cancelled) return;
      setAnalytics({
        categories: categoriesResult.status === 'fulfilled' && categoriesResult.value ? categoriesResult.value : null,
        statuses: statusesResult.status === 'fulfilled' && statusesResult.value ? statusesResult.value : null
      });
    }).finally(() => { if (!cancelled) setAnalyticsLoading(false); });
    return () => { cancelled = true; };
  }, [liveApi]);

  const domainChartData = useMemo(() => {
    if (!analytics.categories || typeof analytics.categories !== 'object') return FALLBACK_DOMAIN_DATA;
    return Object.entries(analytics.categories)
      .map(([name, value]) => ({ name: formatLabel(name), issues: Number(value) || 0 }))
      .sort((a, b) => b.issues - a.issues)
      .slice(0, 8);
  }, [analytics.categories]);

  const statusPieData = useMemo(() => {
    if (!analytics.statuses || typeof analytics.statuses !== 'object') return FALLBACK_STATUS_DATA;
    return Object.entries(analytics.statuses)
      .map(([name, value]) => ({ name: formatLabel(name), value: Number(value) || 0 }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [analytics.statuses]);

  const totalIssueCount = Number(dashboard?.issues ?? stats?.totalIssuesReported ?? issues.length ?? 0);
  const activeProjectCount = Number(dashboard?.activeProjects ?? stats?.activeUniversityProjects ?? 0);
  const organizationCount = Number(dashboard?.organizations ?? 0);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Jharkhand State Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950">{currentUser.name}</h1>
          <p className="text-xs text-jh-earth-600 max-w-xl">
            Statewide monitoring of citizen issues, university R&D, corporate participation, and resolution progress.
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold ${liveApi ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' : 'bg-jh-earth-100 border border-jh-earth-300 text-jh-earth-700'}`}>
          <span className={`w-2 h-2 rounded-full ${liveApi ? 'bg-emerald-500 animate-ping' : 'bg-jh-earth-500'}`}></span>
          <span>{liveApi ? 'Live Platform Data' : 'Demo Data'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total State Issues" value={totalIssueCount} subtitle={dashboard?.openIssues != null ? `${dashboard.openIssues} currently open` : 'Platform issue records'} icon={Activity} color="forest" />
        <StatCard title="CSR Capital Deployed" value={stats?.totalCSRFundingSanctioned ?? '—'} subtitle={organizationCount ? `${organizationCount} organizations registered` : 'Sponsorship records'} icon={Building} color="terracotta" />
        <StatCard title="Active University Labs" value={activeProjectCount} subtitle={dashboard?.projects != null ? `${dashboard.projects} total projects` : 'Active project count'} icon={School} color="blue" />
        <StatCard title="Ecology Restored" value={stats?.forestWaterAreaRestoredSqKm ?? '—'} subtitle="Tracked platform metric" icon={Globe2} color="gold" />
      </div>

      <div className="flex items-center gap-2 border-b border-jh-earth-200 pb-2 overflow-x-auto">
        <button onClick={() => setActiveAdminTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeAdminTab === 'overview' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>Executive Analytics & Charts</button>
        <button onClick={() => setActiveAdminTab('heatmaps')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeAdminTab === 'heatmaps' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>State GIS Heatmap</button>
        <button onClick={() => setActiveAdminTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeAdminTab === 'users' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>User & Role Governance</button>
      </div>

      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">Interventions by Ecological Domain</h3>
              <span className="text-[11px] text-jh-earth-500">{analyticsLoading ? 'Loading…' : liveApi && analytics.categories ? 'Live API' : 'Demo fallback'}</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#453E34' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#453E34' }} />
                  <Tooltip />
                  <Bar dataKey="issues" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">State Grievance Lifecycle Status</h3>
              <span className="text-[11px] text-jh-earth-500">{analyticsLoading ? 'Loading…' : liveApi && analytics.statuses ? 'Live API' : 'Demo fallback'}</span>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                    {statusPieData.map((entry, index) => <Cell key={`cell-${index}`} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {statusPieData.map(d => <div key={d.name} className="flex items-center gap-1.5 font-medium text-jh-earth-800"><span className="w-2.5 h-2.5 rounded-full" /><span className="truncate">{d.name} ({d.value})</span></div>)}
            </div>
          </div>
        </div>
      )}

      {activeAdminTab === 'heatmaps' && <div className="space-y-4"><IssueMap issues={issues} height="600px" /></div>}

      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft overflow-x-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 mb-4">Platform Persona Directory & RBAC Status</h3>
          <p className="text-[11px] text-jh-earth-600 mb-3">This directory is currently backed by demo persona metadata; authentication and authorization remain server-controlled.</p>
          <table className="w-full text-left text-xs">
            <thead className="bg-jh-earth-100 text-jh-earth-800 uppercase font-bold text-[10px]"><tr><th className="p-3">User</th><th className="p-3">System Role</th><th className="p-3">Organization / District</th><th className="p-3">Status</th><th className="p-3 text-right">Access Level</th></tr></thead>
            <tbody className="divide-y divide-jh-earth-100">
              {MOCK_USERS.map(usr => <tr key={usr.id} className="hover:bg-jh-earth-50"><td className="p-3 font-bold text-jh-charcoal flex items-center gap-2"><img src={usr.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" /><span>{usr.name}</span></td><td className="p-3 uppercase font-semibold text-jh-green-900">{usr.role}</td><td className="p-3 text-jh-earth-700">{usr.organization || usr.university || usr.district || 'State HQ'}</td><td className="p-3"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Demo</span></td><td className="p-3 text-right font-mono font-bold text-jh-earth-600">Server RBAC</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
