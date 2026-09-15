import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Card, StatCard } from "../../components/ui/Card";
import { StatusBadge } from "../../components/ui/StatusBadge";
import {
  BookOpen,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";

const statusLabel = (status) =>
  String(status || "TODO").replaceAll("_", " ").toLowerCase();

const progressFor = (project) => {
  const tasks = project.kanbanTasks || project.tasks || [];
  if (!tasks.length) return 0;
  return Math.round(
    (tasks.filter((task) => statusLabel(task.status) === "done").length /
      tasks.length) *
      100,
  );
};

export const FacultyDashboard = ({ currentPath }) => {
  const { currentUser } = useAuth();
  const { projects, sponsors, dataLoading } = useData();
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = projects.find((project) => project.id === selectedId);

  useEffect(() => {
    if (!selectedId && projects.length) setSelectedId(projects[0].id);
    if (selectedId && !projects.some((project) => project.id === selectedId))
      setSelectedId(projects[0]?.id || null);
  }, [projects, selectedId]);

  const totalTasks = projects.reduce(
    (count, project) =>
      count + (project.kanbanTasks || project.tasks || []).length,
    0,
  );
  const completedTasks = projects.reduce(
    (count, project) =>
      count +
      (project.kanbanTasks || project.tasks || []).filter(
        (task) => statusLabel(task.status) === "done",
      ).length,
    0,
  );
  const funded = useMemo(
    () =>
      sponsors.reduce(
        (total, sponsorship) => total + Number(sponsorship.amount || 0),
        0,
      ),
    [sponsors],
  );
  const projectSponsors = selectedProject
    ? sponsors.filter((sponsorship) => sponsorship.projectId === selectedProject.id)
    : [];

  if (currentPath === "csr-connect") {
    return (
      <div className="space-y-6">
        <header>
          <p className="text-xs uppercase tracking-wider text-jh-terracotta-700 font-bold">Read-only view</p>
          <h1 className="text-2xl font-bold text-jh-green-950 mt-1">CSR funding for mentored projects</h1>
          <p className="text-sm text-jh-earth-600 mt-1">Funding records and delivery progress for projects you mentor.</p>
        </header>
        {!sponsors.length && <Card className="text-center py-10 text-sm text-jh-earth-600">No CSR funding has been recorded for your mentored projects.</Card>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => {
            const projectFunding = sponsors.filter((sponsorship) => sponsorship.projectId === project.id);
            return (
              <Card key={project.id}>
                <div className="flex justify-between gap-3">
                  <h2 className="font-bold text-jh-green-950">{project.title}</h2>
                  <span className="text-sm font-bold text-jh-green-800">{progressFor(project)}%</span>
                </div>
                <p className="text-xs text-jh-earth-600 mt-1">Task progress</p>
                {projectFunding.length ? projectFunding.map((sponsorship) => (
                  <div key={sponsorship.id} className="mt-3 flex justify-between text-sm border-t border-jh-earth-100 pt-2">
                    <span>{sponsorship.organizationName} · {sponsorship.status}</span>
                    <strong>₹{Number(sponsorship.amount || 0).toLocaleString("en-IN")}</strong>
                  </div>
                )) : <p className="text-xs text-jh-earth-500 mt-3">No funding recorded.</p>}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-3xl p-6 border border-jh-earth-200 shadow-jh-soft">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          Faculty workspace
        </div>
        <h1 className="text-2xl font-bold text-jh-green-950 mt-3">
          Welcome, {currentUser?.name || "Faculty"}
        </h1>
        <p className="text-sm text-jh-earth-600 mt-1">
          View the projects you mentor, their teams, delivery progress, and recorded CSR support.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Mentored projects" value={projects.length} icon={BookOpen} color="forest" />
        <StatCard
          title="Researchers"
          value={projects.reduce((count, project) => count + (project.teamMembers?.length || 0), 0)}
          icon={Users}
          color="blue"
        />
        <StatCard title="Tasks complete" value={`${completedTasks}/${totalTasks}`} icon={CheckCircle2} color="terracotta" />
        <StatCard title="CSR funding" value={`₹${(funded / 100000).toFixed(1)}L`} icon={CircleDollarSign} color="gold" />
      </div>

      {dataLoading && <p className="text-sm text-jh-earth-600">Loading your mentored projects…</p>}
      {!dataLoading && !projects.length && (
        <Card className="text-center py-12">
          <BookOpen className="w-9 h-9 mx-auto text-jh-green-700 mb-3" />
          <h2 className="font-bold text-jh-green-950">No mentored projects</h2>
          <p className="text-sm text-jh-earth-600 mt-1">Projects appear here when you are added as a mentor.</p>
        </Card>
      )}

      {!!projects.length && (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5">
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-jh-green-950">Mentored projects</h2>
            {projects.map((project) => {
              const progress = progressFor(project);
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition ${
                    selectedId === project.id
                      ? "border-jh-green-700 bg-jh-green-50 shadow-jh-soft"
                      : "border-jh-earth-200 bg-white hover:border-jh-green-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-jh-green-950">{project.title}</h3>
                      <p className="text-xs text-jh-earth-600 mt-1">{project.universityName || "University project"}</p>
                    </div>
                    <StatusBadge status={String(project.status || "").toUpperCase()} />
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-jh-earth-600">
                      <span>Task progress</span><strong>{progress}%</strong>
                    </div>
                    <div className="h-2 bg-jh-earth-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-jh-green-700 rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          {selectedProject && (
            <Card className="space-y-5">
              <div className="border-b border-jh-earth-200 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-jh-earth-500 font-bold">Project workspace</p>
                    <h2 className="text-xl font-bold text-jh-green-950 mt-1">{selectedProject.title}</h2>
                  </div>
                  <StatusBadge status={String(selectedProject.status || "").toUpperCase()} />
                </div>
                <p className="text-sm text-jh-earth-600 mt-2">{selectedProject.description || "No project description recorded."}</p>
              </div>
              <div>
                <h3 className="font-bold text-sm text-jh-green-950 flex items-center gap-2"><Users className="w-4 h-4" />Members</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProject.teamMembers?.length ? selectedProject.teamMembers.map((member) => (
                    <span key={member.id} className="px-3 py-1.5 rounded-full bg-jh-earth-50 border border-jh-earth-200 text-xs">
                      {member.userName} {member.memberRole ? `· ${member.memberRole}` : ""}
                    </span>
                  )) : <span className="text-xs text-jh-earth-500">No members recorded.</span>}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-jh-green-950 flex items-center gap-2"><ClipboardList className="w-4 h-4" />Tasks and status</h3>
                <div className="divide-y divide-jh-earth-100 mt-2">
                  {(selectedProject.kanbanTasks || []).length ? selectedProject.kanbanTasks.map((task) => (
                    <div key={task.id} className="py-2 flex items-center justify-between gap-3 text-sm">
                      <span>{task.title}</span><StatusBadge status={String(task.status || "").toUpperCase()} />
                    </div>
                  )) : <p className="text-xs text-jh-earth-500 py-2">No tasks recorded.</p>}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-sm text-jh-green-950 flex items-center gap-2"><CircleDollarSign className="w-4 h-4" />CSR funding and progress</h3>
                {projectSponsors.length ? projectSponsors.map((sponsorship) => (
                  <div key={sponsorship.id} className="mt-2 flex justify-between text-sm bg-jh-earth-50 rounded-xl p-3">
                    <span>{sponsorship.organizationName} · {sponsorship.status}</span>
                    <strong>₹{Number(sponsorship.amount || 0).toLocaleString("en-IN")}</strong>
                  </div>
                )) : <p className="text-xs text-jh-earth-500 mt-2">No CSR funding recorded for this project.</p>}
                <p className="text-xs text-jh-earth-600 mt-3">Overall task progress: <strong>{progressFor(selectedProject)}%</strong></p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
