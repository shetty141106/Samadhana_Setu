import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { KanbanBoard } from '../../components/projects/KanbanBoard';
import { Button } from '../../components/ui/Button';
import { KanbanSquare, CheckSquare, Users, Clock, Sparkles, Award } from 'lucide-react';

export const StudentDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { projects } = useData();
  const activeProject = projects.find(p => p.id === currentUser.project) || projects[0] || null;

  if (!activeProject) {
    return <div className="space-y-6"><div className="bg-white rounded-3xl p-8 border border-jh-earth-200 shadow-jh-soft"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold"><Sparkles className="w-3.5 h-3.5" />Student Innovation Lab</div><h1 className="mt-4 text-2xl font-bold text-jh-green-950">No research project assigned yet</h1><p className="mt-2 text-sm text-jh-earth-600 max-w-xl">Your student workspace is ready. A faculty/admin assignment is required before project and Kanban data can be displayed.</p></div></div>;
  }

  const totalTasks = activeProject.kanbanTasks?.length || 0;
  const doneTasks = activeProject.kanbanTasks?.filter(t => String(t.status).toLowerCase() === 'done').length || 0;
  const inProgressTasks = activeProject.kanbanTasks?.filter(t => String(t.status).toLowerCase() === 'in_progress').length || 0;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4"><div className="space-y-1.5"><div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold"><Sparkles className="w-3.5 h-3.5" />Student Innovation Lab • {currentUser.university || 'IIT (ISM) Dhanbad'}</div><h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950">{currentUser.name}</h1><p className="text-xs text-jh-earth-600 max-w-xl">Lead Student Researcher for project <strong className="text-jh-green-900">{activeProject.id}</strong> — Developing sustainable bio-technological solutions for Jharkhand's river catchments.</p></div><div className="flex items-center gap-2"><Button variant="secondary" size="md" icon={KanbanSquare} onClick={() => onNavigate('kanban')}>Open Sprint Kanban</Button></div></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><StatCard title="Sprint Tasks" value={`${doneTasks} / ${totalTasks}`} subtitle={`${activeProject.progressPercentage}% Sprint Velocity`} icon={CheckSquare} color="forest" /><StatCard title="Active in Lab" value={inProgressTasks} subtitle="Prototyping & testing" icon={Clock} color="blue" /><StatCard title="Team Researchers" value={`${activeProject.teamMembers?.length || 0} Scholars`} subtitle="Multi-disciplinary lab" icon={Users} color="terracotta" /><StatCard title="Faculty Mentor" value={activeProject.facultyMentor || 'Assigned Faculty'} subtitle="Project mentor" icon={Award} color="gold" /></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6"><div className="lg:col-span-4 space-y-4"><div className="bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft space-y-4"><h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950">Active Research Initiative</h3><div><span className="text-[10px] font-bold uppercase text-jh-terracotta-700 bg-jh-terracotta-50 px-2 py-0.5 rounded border border-jh-terracotta-200">{activeProject.domain || 'Research'}</span><h4 className="text-sm font-bold text-jh-green-950 mt-1.5 leading-snug">{activeProject.title}</h4></div><div className="space-y-2 text-xs text-jh-earth-700 pt-2 border-t border-jh-earth-100"><div className="flex items-center justify-between gap-3"><span>Academic Institution:</span><strong className="text-jh-charcoal text-right">{activeProject.university || 'Not assigned'}</strong></div><div className="flex items-center justify-between gap-3"><span>CSR Industry Partner:</span><strong className="text-jh-terracotta-700 text-right">{activeProject.sponsor || 'Not funded'}</strong></div><div className="flex items-center justify-between gap-3"><span>Sanctioned Grant:</span><strong className="text-jh-green-900 font-mono">₹ {((Number(activeProject.budgetFunded) || 0) / 100000).toFixed(1)} Lakh</strong></div></div><div className="pt-3 border-t border-jh-earth-100"><h4 className="text-xs font-bold uppercase tracking-wider text-jh-earth-800 mb-2">Team Roster ({activeProject.teamMembers?.length || 0})</h4><div className="space-y-2">{activeProject.teamMembers?.map((m, idx) => <div key={m.id || idx} className="flex items-center justify-between text-xs bg-jh-earth-50 p-2 rounded-lg"><span className="font-bold text-jh-charcoal">{m.name}</span><span className="text-[10.5px] text-jh-earth-600 truncate max-w-[140px]">{m.role}</span></div>)}</div></div></div></div><div className="lg:col-span-8"><div className="bg-white rounded-2xl border border-jh-earth-200 p-5 shadow-jh-soft"><KanbanBoard project={activeProject} /></div></div></div>
    </div>
  );
};
