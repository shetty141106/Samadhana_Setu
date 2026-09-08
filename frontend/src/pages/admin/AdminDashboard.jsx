import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { IssueMap } from '../../components/maps/IssueMap';
import { IssueDetailModal } from '../../components/issues/IssueDetailModal';
import { dashboardApi } from '../../api/dashboard.api';
import { usersApi } from '../../api/users.api';
import { ShieldCheck, Activity, Globe2, School, Building, Plus, Search, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const ROLE_OPTIONS = [
  { value: 'NODAL_OFFICER', label: 'Nodal Officer' },
  { value: 'FACULTY', label: 'Academic Faculty' },
  { value: 'STUDENT', label: 'Student Researcher' },
  { value: 'INDUSTRY', label: 'Industry / CSR Partner' },
  { value: 'ADMIN', label: 'System Admin' }
];
const formatLabel = value => String(value || '').toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

export const AdminDashboard = ({ currentPath }) => {
  const { currentUser } = useAuth();
  const { issues, stats, dashboard, liveApi } = useData();
  const [activeAdminTab, setActiveAdminTab] = useState(currentPath === 'heatmaps' ? 'heatmaps' : currentPath === 'user-management' ? 'users' : 'overview');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [analytics, setAnalytics] = useState({ categories: null, statuses: null });
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'NODAL_OFFICER' });
  const [savingUser, setSavingUser] = useState(false);

  useEffect(() => {
    if (currentPath === 'heatmaps') setActiveAdminTab('heatmaps');
    else if (currentPath === 'user-management') setActiveAdminTab('users');
    else setActiveAdminTab('overview');
  }, [currentPath]);
  useEffect(() => {
    if (!liveApi) return;
    Promise.allSettled([dashboardApi.getIssueCategories(), dashboardApi.getIssueStatus()]).then(([categories, statuses]) => setAnalytics({ categories: categories.status === 'fulfilled' ? categories.value : null, statuses: statuses.status === 'fulfilled' ? statuses.value : null }));
  }, [liveApi]);
  const loadUsers = async () => {
    if (!liveApi) return;
    setUsersLoading(true); setUserError('');
    try { const data = await usersApi.listUsers(); setUsers(Array.isArray(data) ? data : []); } catch (error) { setUserError(error.message || 'Unable to load users.'); } finally { setUsersLoading(false); }
  };
  useEffect(() => { if (activeAdminTab === 'users') loadUsers(); }, [activeAdminTab, liveApi]);
  const domainChartData = useMemo(() => analytics.categories && typeof analytics.categories === 'object' ? Object.entries(analytics.categories).map(([name, value]) => ({ name: formatLabel(name), issues: Number(value) || 0 })).sort((a,b) => b.issues-a.issues).slice(0,8) : [], [analytics.categories]);
  const statusPieData = useMemo(() => analytics.statuses && typeof analytics.statuses === 'object' ? Object.entries(analytics.statuses).map(([name, value]) => ({ name: formatLabel(name), value: Number(value) || 0 })).filter(x => x.value > 0).sort((a,b) => b.value-a.value) : [], [analytics.statuses]);
  const filteredUsers = useMemo(() => { const q = userSearch.trim().toLowerCase(); if (!q) return users; return users.filter(u => [u.name, u.email, u.role].some(v => String(v || '').toLowerCase().includes(q))); }, [users, userSearch]);
  const createUser = async event => { event.preventDefault(); setSavingUser(true); setUserError(''); try { const created = await usersApi.createUser(form); setUsers(prev => [created, ...prev]); setForm({ name: '', email: '', password: '', role: 'NODAL_OFFICER' }); setShowAddUser(false); } catch (error) { setUserError(error.message || 'Unable to create user.'); } finally { setSavingUser(false); } };
  const totalIssueCount = Number(dashboard?.issues ?? stats?.totalIssuesReported ?? issues.length ?? 0);
  const activeProjectCount = Number(dashboard?.activeProjects ?? stats?.activeUniversityProjects ?? 0);
  const organizationCount = Number(dashboard?.organizations ?? 0);

  return <div className="space-y-8">
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold"><ShieldCheck className="w-3.5 h-3.5" />State Command Center</div><h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950 mt-2">{currentUser?.name || 'Administrator'}</h1><p className="text-xs text-jh-earth-600 mt-1">Manage platform operations, users, roles and statewide civic intelligence.</p></div><span className={`px-3.5 py-1.5 rounded-xl text-xs font-bold ${liveApi ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' : 'bg-amber-50 border border-amber-300 text-amber-800'}`}>{liveApi ? 'Live Platform Data' : 'Live API Required'}</span></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><StatCard title="Total State Issues" value={totalIssueCount} subtitle={dashboard?.openIssues != null ? `${dashboard.openIssues} currently open` : 'Live issue records'} icon={Activity} color="forest" /><StatCard title="CSR Capital Deployed" value={stats?.totalCSRFundingSanctioned ?? '—'} subtitle={organizationCount ? `${organizationCount} organizations registered` : 'Live sponsorship records'} icon={Building} color="terracotta" /><StatCard title="Active University Labs" value={activeProjectCount} subtitle={dashboard?.projects != null ? `${dashboard.projects} total projects` : 'Live project count'} icon={School} color="blue" /><StatCard title="Ecology Restored" value={stats?.forestWaterAreaRestoredSqKm ?? '—'} subtitle="Live platform metric" icon={Globe2} color="gold" /></div>
    <div className="flex items-center gap-2 border-b border-jh-earth-200 pb-2 overflow-x-auto"><button onClick={() => setActiveAdminTab('overview')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${activeAdminTab === 'overview' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>Executive Analytics & Charts</button><button onClick={() => setActiveAdminTab('heatmaps')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${activeAdminTab === 'heatmaps' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>State GIS Heatmap</button><button onClick={() => setActiveAdminTab('users')} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${activeAdminTab === 'users' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'}`}>User & Role Governance</button></div>
    {activeAdminTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="lg:col-span-7 bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft"><h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 mb-4">Interventions by Ecological Domain</h3>{domainChartData.length ? <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={domainChartData}><XAxis dataKey="name" tick={{fontSize:11}} /><YAxis allowDecimals={false} tick={{fontSize:11}} /><Tooltip /><Bar dataKey="issues" radius={[6,6,0,0]} /></BarChart></ResponsiveContainer></div> : <div className="h-64 grid place-items-center text-xs text-jh-earth-500">No live analytics available.</div>}</div><div className="lg:col-span-5 bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft"><h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 mb-4">State Grievance Lifecycle Status</h3>{statusPieData.length ? <><div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">{statusPieData.map((_, i) => <Cell key={i} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="grid grid-cols-2 gap-2 text-[10.5px]">{statusPieData.map(d => <div key={d.name} className="font-medium text-jh-earth-800 truncate">{d.name} ({d.value})</div>)}</div></> : <div className="h-64 grid place-items-center text-xs text-jh-earth-500">No live analytics available.</div>}</div></div>}
    {activeAdminTab === 'heatmaps' && <><div className="mb-3 text-xs text-jh-earth-600">Select any issue marker to inspect its full case and persisted AI analysis.</div><IssueMap issues={issues} onSelectIssue={setSelectedIssue} height="600px" /></>}
    {activeAdminTab === 'users' && <div className="bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft"><div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4"><div><h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">User & Role Governance</h3><p className="text-[11px] text-jh-earth-600 mt-1">Create every operational role except Citizen. Credentials are stored by the backend.</p></div><button onClick={() => setShowAddUser(true)} disabled={!liveApi} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-jh-green-900 text-white text-xs font-bold disabled:opacity-50"><Plus className="w-4 h-4" />Add User</button></div><div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-jh-earth-500" /><input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users by name, email or role..." className="w-full pl-9 pr-4 py-2 text-xs bg-jh-earth-50 border border-jh-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-jh-green-700/40" /></div>{userError && <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">{userError}</div>}<div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-jh-earth-100 uppercase font-bold text-[10px]"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th></tr></thead><tbody className="divide-y divide-jh-earth-100">{usersLoading ? <tr><td colSpan="3" className="p-6 text-center text-jh-earth-500">Loading users…</td></tr> : filteredUsers.length ? filteredUsers.map(u => <tr key={u.id} className="hover:bg-jh-earth-50"><td className="p-3 font-bold text-jh-charcoal">{u.name}</td><td className="p-3 text-jh-earth-700">{u.email}</td><td className="p-3 uppercase font-semibold text-jh-green-900">{formatLabel(u.role)}</td></tr>) : <tr><td colSpan="3" className="p-6 text-center text-jh-earth-500">No users found.</td></tr>}</tbody></table></div>{showAddUser && <div className="fixed inset-0 z-50 bg-black/30 grid place-items-center p-4"><form onSubmit={createUser} className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl border border-jh-earth-200"><div className="flex items-center justify-between mb-5"><h3 className="font-bold text-jh-green-950">Add Platform User</h3><button type="button" onClick={() => setShowAddUser(false)}><X className="w-5 h-5" /></button></div><div className="space-y-3"><input required value={form.name} onChange={e => setForm({...form,name:e.target.value})} placeholder="Full name" className="w-full px-3 py-2 text-sm border rounded-xl" /><input required type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="Email" className="w-full px-3 py-2 text-sm border rounded-xl" /><input required minLength="8" type="password" value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="Temporary password (8+ characters)" className="w-full px-3 py-2 text-sm border rounded-xl" /><select value={form.role} onChange={e => setForm({...form,role:e.target.value})} className="w-full px-3 py-2 text-sm border rounded-xl">{ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}</select></div><button disabled={savingUser} className="w-full mt-5 py-2.5 rounded-xl bg-jh-green-900 text-white text-sm font-bold disabled:opacity-50">{savingUser ? 'Creating…' : 'Create User'}</button></form></div>}</div>}
    {selectedIssue && <IssueDetailModal issue={selectedIssue} isOpen onClose={() => setSelectedIssue(null)} />}
  </div>;
};
