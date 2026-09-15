import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { GraduationCap, Users, Activity } from "lucide-react";

export const FacultyDashboard = () => {
  const { currentUser } = useAuth();
  const { projects } = useData();
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const mentoredProjects = useMemo(
    () =>
      projects.filter((project) =>
        (project.teamMembers || []).some(
          (member) =>
            String(member.userId) === String(currentUser?.id) &&
            String(member.memberRole || "").toUpperCase() === "FACULTY",
        ),
      ),
    [projects, currentUser?.id],
  );
  const selectedProject =
    mentoredProjects.find((project) => project.id === selectedProjectId) ||
    mentoredProjects[0];

  const taskCounts = (project) =>
    (project.kanbanTasks || []).reduce(
      (counts, task) => {
        const status = String(task.status || "TODO").toUpperCase();
        counts[status] = (counts[status] || 0) + 1;
        return counts;
      },
      {},
    );

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-semibold">
          <GraduationCap className="w-3.5 h-3.5" />
          Academic R&D Mentor
        </div>
        <h1 className="text-2xl font-bold text-jh-green-950 mt-2">
          Mentored Projects
        </h1>
        <p className="text-xs text-jh-earth-600">
          Projects where you are an assigned faculty mentor.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric title="Mentored Projects" value={mentoredProjects.length} icon={GraduationCap} />
        <Metric
          title="Project Members"
          value={mentoredProjects.reduce((sum, project) => sum + (project.teamMembers?.length || 0), 0)}
          icon={Users}
        />
        <Metric
          title="Active Kanban Tasks"
          value={mentoredProjects.reduce((sum, project) => sum + (project.kanbanTasks?.length || 0), 0)}
          icon={Activity}
        />
      </div>

      {mentoredProjects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] gap-5">
          <div className="space-y-3">
            {mentoredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className={`w-full text-left rounded-2xl border p-4 transition-colors ${
                  selectedProject?.id === project.id
                    ? "border-jh-green-700 bg-jh-green-50"
                    : "border-jh-earth-200 bg-white hover:bg-jh-earth-50"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-bold text-jh-green-950">{project.title}</h2>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-jh-earth-600 mt-1 line-clamp-2">
                  {project.description || "No description provided."}
                </p>
              </button>
            ))}
          </div>

          {selectedProject && (
            <div className="rounded-2xl border border-jh-earth-200 bg-white p-5 shadow-jh-soft space-y-5">
              <div className="flex items-center justify-between gap-3 border-b border-jh-earth-200 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-jh-green-950">{selectedProject.title}</h2>
                  <p className="text-xs text-jh-earth-600 mt-1">
                    Current members and Kanban status
                  </p>
                </div>
                <StatusBadge status={selectedProject.status} />
              </div>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 mb-2">
                  Current Project Members
                </h3>
                <div className="space-y-2">
                  {(selectedProject.teamMembers || []).map((member) => (
                    <div key={member.id || member.userId} className="flex justify-between rounded-xl bg-jh-earth-50 px-3 py-2 text-xs">
                      <span className="font-semibold">{member.userName || "Project member"}</span>
                      <span className="text-jh-earth-600">{member.memberRole || "Member"}</span>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-jh-green-950 mb-2">
                  Kanban Status
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["TODO", "IN_PROGRESS", "REVIEW", "DONE"].map((status) => (
                    <div key={status} className="rounded-xl border border-jh-earth-200 p-3">
                      <p className="text-[10px] uppercase text-jh-earth-500">{status.replace("_", " ")}</p>
                      <p className="text-xl font-bold text-jh-green-950">{taskCounts(selectedProject)[status] || 0}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Metric = ({ title, value, icon: Icon }) => (
  <div className="rounded-2xl border border-jh-earth-200 bg-white p-4">
    <Icon className="w-5 h-5 text-jh-green-800 mb-2" />
    <p className="text-[10px] uppercase font-bold text-jh-earth-600">{title}</p>
    <p className="text-2xl font-bold text-jh-green-950">{value}</p>
  </div>
);

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-jh-earth-300 bg-white p-10 text-center text-sm text-jh-earth-600">
    No projects are currently assigned to you as a faculty mentor.
  </div>
);
