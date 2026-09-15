import React, { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Pencil, Save, X } from "lucide-react";

export const NodalProjectsPage = () => {
  const { currentUser } = useAuth();
  const { projects, updateProject } = useData();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [error, setError] = useState("");

  const createdProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          String(project.createdById) === String(currentUser?.id),
      ),
    [projects, currentUser?.id],
  );

  const beginEdit = (project) => {
    setError("");
    setEditingId(project.id);
    setDraft({
      title: project.title || "",
      description: project.description || "",
      status: String(project.status || "planned").toUpperCase(),
    });
  };

  const saveEdit = async (project) => {
    setError("");
    try {
      await updateProject(project.id, draft);
      setEditingId(null);
      setDraft(null);
    } catch (saveError) {
      setError(saveError?.data?.message || saveError?.message || "Unable to update project.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-jh-green-950">Created Projects</h2>
        <p className="text-xs text-jh-earth-600">
          Projects created from issues verified by you.
        </p>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-jh-earth-200 bg-white p-4">
          <p className="text-[10px] uppercase font-bold text-jh-earth-600">Total Created</p>
          <p className="text-2xl font-bold text-jh-green-950">{createdProjects.length}</p>
        </div>
        <div className="rounded-2xl border border-jh-earth-200 bg-white p-4">
          <p className="text-[10px] uppercase font-bold text-jh-earth-600">Planned</p>
          <p className="text-2xl font-bold text-jh-green-950">
            {createdProjects.filter((p) => String(p.status).toUpperCase() === "PLANNED").length}
          </p>
        </div>
        <div className="rounded-2xl border border-jh-earth-200 bg-white p-4">
          <p className="text-[10px] uppercase font-bold text-jh-earth-600">Active</p>
          <p className="text-2xl font-bold text-jh-green-950">
            {createdProjects.filter((p) => String(p.status).toUpperCase() === "ACTIVE").length}
          </p>
        </div>
        <div className="rounded-2xl border border-jh-earth-200 bg-white p-4">
          <p className="text-[10px] uppercase font-bold text-jh-earth-600">Completed</p>
          <p className="text-2xl font-bold text-jh-green-950">
            {createdProjects.filter((p) => String(p.status).toUpperCase() === "COMPLETED").length}
          </p>
        </div>
        <div className="rounded-2xl border border-jh-earth-200 bg-white p-4">
          <p className="text-[10px] uppercase font-bold text-jh-earth-600">On Hold</p>
          <p className="text-2xl font-bold text-jh-green-950">
            {createdProjects.filter((p) => String(p.status).toUpperCase() === "ON_HOLD").length}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {createdProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-jh-earth-300 bg-white p-10 text-center text-sm text-jh-earth-600">
            No projects created yet.
          </div>
        ) : (
          createdProjects.map((project) => (
            <div key={project.id} className="rounded-2xl border border-jh-earth-200 bg-white p-5 shadow-jh-soft">
              {editingId === project.id ? (
                <div className="space-y-3">
                  <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" />
                  <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full rounded-xl border px-3 py-2 text-sm" rows={3} />
                  <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
                    {["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <Button size="sm" icon={Save} onClick={() => saveEdit(project)}>Save</Button>
                    <Button size="sm" variant="ghost" icon={X} onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-jh-green-950">{project.title}</h3>
                      <StatusBadge status={project.status} />
                    </div>
                    <p className="mt-1 text-sm text-jh-earth-700">{project.description || "No description provided."}</p>
                    <p className="mt-2 text-xs text-jh-earth-500">
                      Source issue: {project.sourceIssueId || "Not linked"} · Milestones: {project.milestoneCount || 0} · Tasks: {project.taskCount || 0}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" icon={Pencil} onClick={() => beginEdit(project)}>Edit</Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
