import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { IssueMap } from '../../components/maps/IssueMap';
import { Button } from '../../components/ui/Button';
import { MOCK_USERS } from '../../data/mockData';
import { 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Globe2, 
  Layers, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  School,
  Building,
  ArrowUpRight
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

export const AdminDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { issues, projects, stats } = useData();
  const [activeAdminTab, setActiveAdminTab] = useState('overview'); // 'overview' | 'heatmaps' | 'users'

  const domainChartData = [
    { name: 'Water', issues: 18, fill: '#0284c7' },
    { name: 'Mining', issues: 24, fill: '#c45c26' },
    { name: 'Forest', issues: 14, fill: '#1b5e3b' },
    { name: 'Solar', issues: 11, fill: '#e07a3d' },
    { name: 'Civic', issues: 9, fill: '#475569' },
    { name: 'AgriTech', issues: 10, fill: '#16a34a' }
  ];

  const statusPieData = [
    { name: 'Resolved', value: 35, color: '#10b981' },
    { name: 'In University R&D', value: 28, color: '#8b5cf6' },
    { name: 'CSR Funded', value: 20, color: '#f59e0b' },
    { name: 'Under Nodal Verification', value: 17, color: '#3b82f6' }
  ];

  return (
    <div className="space-y-8">
      
      {/* State Command Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Jharkhand State Command Center • Principal Secretary Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950">
            {currentUser.name}
          </h1>
          <p className="text-xs text-jh-earth-600 max-w-xl">
            Statewide real-time monitoring of 24 district portals, university research labs, corporate CSR disbursements, and citizen satisfaction metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>All 24 Districts Live</span>
          </div>
        </div>
      </div>

      {/* Admin KPI Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total State Issues"
          value={stats.totalIssuesReported}
          subtitle="92% Verified on Ground"
          icon={Activity}
          color="forest"
        />
        <StatCard
          title="CSR Capital Deployed"
          value={stats.totalCSRFundingSanctioned}
          subtitle="16 Corporate Partners"
          icon={Building}
          color="terracotta"
        />
        <StatCard
          title="Active University Labs"
          value={stats.activeUniversityProjects}
          subtitle="IIT ISM, BIT, NIT & BAU"
          icon={School}
          color="blue"
        />
        <StatCard
          title="Ecology Restored"
          value={stats.forestWaterAreaRestoredSqKm}
          subtitle="Chota Nagpur Plateau"
          icon={Globe2}
          color="gold"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-jh-earth-200 pb-2">
        <button
          onClick={() => setActiveAdminTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'overview' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'
          }`}
        >
          Executive Analytics & Charts
        </button>
        <button
          onClick={() => setActiveAdminTab('heatmaps')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'heatmaps' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'
          }`}
        >
          State GIS Heatmap
        </button>
        <button
          onClick={() => setActiveAdminTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeAdminTab === 'users' ? 'bg-jh-green-900 text-white' : 'text-jh-earth-700 hover:bg-jh-earth-100'
          }`}
        >
          User & Role Governance
        </button>
      </div>

      {/* Tab 1: Executive Analytics */}
      {activeAdminTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Bar Chart (Domain distribution) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">
                Interventions by Ecological Domain
              </h3>
              <span className="text-[11px] text-jh-earth-500">Live Telemetry</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={domainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#453E34' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#453E34' }} />
                  <Tooltip />
                  <Bar dataKey="issues" radius={[6, 6, 0, 0]}>
                    {domainChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart (Status Breakdown) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">
                State Grievance Lifecycle Status
              </h3>
              <span className="text-[11px] text-jh-earth-500">Breakdown %</span>
            </div>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10.5px]">
              {statusPieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 font-medium text-jh-earth-800">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="truncate">{d.name} ({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: GIS Heatmaps */}
      {activeAdminTab === 'heatmaps' && (
        <div className="space-y-4">
          <IssueMap issues={issues} height="600px" />
        </div>
      )}

      {/* Tab 3: User Governance */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft overflow-x-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 mb-4">
            Platform Persona Directory & RBAC Status
          </h3>
          <table className="w-full text-left text-xs">
            <thead className="bg-jh-earth-100 text-jh-earth-800 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">System Role</th>
                <th className="p-3">Organization / District</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-jh-earth-100">
              {MOCK_USERS.map((usr) => (
                <tr key={usr.id} className="hover:bg-jh-earth-50">
                  <td className="p-3 font-bold text-jh-charcoal flex items-center gap-2">
                    <img src={usr.avatar} alt="" className="w-7 h-7 rounded-lg object-cover" />
                    <span>{usr.name}</span>
                  </td>
                  <td className="p-3 uppercase font-semibold text-jh-green-900">{usr.role}</td>
                  <td className="p-3 text-jh-earth-700">{usr.organization || usr.university || usr.district || 'State HQ'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Active</span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-jh-earth-600">Full RBAC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
