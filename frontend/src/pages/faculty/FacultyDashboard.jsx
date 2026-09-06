import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/ui/Card';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { KanbanBoard } from '../../components/projects/KanbanBoard';
import { Button } from '../../components/ui/Button';
import { 
  GraduationCap, 
  Award, 
  Users, 
  Coins, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  FileText,
  School,
  Sparkles
} from 'lucide-react';

export const FacultyDashboard = ({ currentPath, onNavigate }) => {
  const { currentUser } = useAuth();
  const { projects, updateMilestone } = useData();
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(null);

  const handleApproveMilestone = (prjId, idx) => {
    updateMilestone(prjId, idx, 'completed');
    setShowApprovalSuccess(idx);
    setTimeout(() => setShowApprovalSuccess(null), 3000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-jh-earth-200 shadow-jh-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic R&D Mentor • {currentUser.university || 'IIT (ISM) Dhanbad'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-jh-green-950">
            {currentUser.name}
          </h1>
          <p className="text-xs text-jh-earth-600 max-w-xl">
            {currentUser.title || 'Department of Environmental Science & Engineering'} — Guiding multi-disciplinary student innovations and validating scientific interventions for CSR grant deployment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            icon={Coins}
            onClick={() => onNavigate('browse-projects')}
          >
            CSR Marketplace
          </Button>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mentored Projects"
          value={projects.length}
          subtitle="Active lab initiatives"
          icon={School}
          color="forest"
        />
        <StatCard
          title="Student Researchers"
          value="18 Scholars"
          subtitle="M.Tech & B.Tech Fellows"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="CSR Grants Backing"
          value="₹ 27.3 Lakh"
          subtitle="Tata Steel & Coal India"
          icon={Coins}
          color="gold"
        />
        <StatCard
          title="Patents & Papers"
          value="4 Filed"
          subtitle="Grassroots technologies"
          icon={Award}
          color="terracotta"
        />
      </div>

      {/* Main R&D Workspace: Active Project Selector & Detail */}
      <div className="space-y-6">
        
        {/* Project Selector Tabs */}
        <div className="flex items-center justify-between border-b border-jh-earth-200 pb-3">
          <div>
            <h3 className="text-base font-bold text-jh-green-950">
              Active University Lab Innovations
            </h3>
            <p className="text-xs text-jh-earth-600">Select a project to review milestones and sprint Kanban</p>
          </div>

          <div className="flex items-center gap-2">
            {projects.map((prj) => (
              <button
                key={prj.id}
                onClick={() => setSelectedProject(prj)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedProject.id === prj.id
                    ? 'bg-jh-green-900 text-white shadow-xs'
                    : 'bg-white border border-jh-earth-200 text-jh-charcoal hover:bg-jh-earth-100'
                }`}
              >
                {prj.id}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Project Overview Card */}
        {selectedProject && (
          <div className="bg-white rounded-2xl border border-jh-earth-200 p-6 shadow-jh-soft space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-jh-earth-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-jh-terracotta-700 bg-jh-terracotta-50 px-2.5 py-1 rounded-md border border-jh-terracotta-200">
                  {selectedProject.domain} • {selectedProject.stage}
                </span>
                <h2 className="text-xl font-bold text-jh-green-950 mt-2">
                  {selectedProject.title}
                </h2>
                <p className="text-xs text-jh-earth-600 mt-1">
                  Lead Student: <strong className="text-jh-charcoal">{selectedProject.studentLead}</strong> • Sponsor: <strong className="text-jh-terracotta-700">{selectedProject.sponsor || 'Self Funded'}</strong>
                </p>
              </div>

              <div className="flex items-center gap-4 bg-jh-earth-50 p-3.5 rounded-xl border border-jh-earth-200">
                <div>
                  <span className="text-[10px] uppercase text-jh-earth-500 font-bold block">Sprint Velocity</span>
                  <span className="text-xl font-extrabold text-jh-green-900">{selectedProject.progressPercentage}%</span>
                </div>
                <div className="h-8 w-px bg-jh-earth-300"></div>
                <div>
                  <span className="text-[10px] uppercase text-jh-earth-500 font-bold block">CSR Allocated</span>
                  <span className="text-xl font-extrabold text-jh-terracotta-700">₹ {(selectedProject.budgetFunded/100000).toFixed(1)} L</span>
                </div>
              </div>
            </div>

            {/* Milestones Validation Desk */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-jh-terracotta-600" />
                  <span>Faculty Milestone Validation & Tranche Clearance</span>
                </h4>
                {showApprovalSuccess !== null && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full animate-bounce">
                    ✓ Milestone Approved & Tranche Released!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {selectedProject.milestones.map((ms, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs flex flex-col justify-between space-y-3 ${
                      ms.status === 'completed'
                        ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        : ms.status === 'in_progress'
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950'
                        : 'bg-jh-earth-50 border-jh-earth-200 text-jh-earth-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                        <span>Milestone #{idx + 1}</span>
                        <span className={ms.status === 'completed' ? 'text-emerald-700' : 'text-jh-earth-500'}>
                          {ms.status}
                        </span>
                      </div>
                      <p className="font-bold text-jh-charcoal leading-snug">{ms.title}</p>
                      <p className="text-[10.5px] text-jh-earth-500 mt-1">Target: {ms.date}</p>
                    </div>

                    {ms.status !== 'completed' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveMilestone(selectedProject.id, idx)}
                        className="w-full text-xs"
                      >
                        Approve Deliverable
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Kanban Board */}
            <div className="pt-4 border-t border-jh-earth-200">
              <KanbanBoard project={selectedProject} />
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
