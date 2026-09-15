import React from "react";
import { useData } from "../../context/DataContext";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Building2, Activity, Coins } from "lucide-react";

export const IndustryDashboard = () => {
  const { projects } = useData();
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <Building2 className="w-3.5 h-3.5" />
          Industry & CSR Projects
        </div>
        <h1 className="text-2xl font-bold text-jh-green-950 mt-2">R&D Projects</h1>
        <p className="text-xs text-jh-earth-600">
          View project status, sprint velocity, and CSR allocation.
        </p>
      </div>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-jh-earth-300 bg-white p-10 text-center text-sm text-jh-earth-600">
            No projects are available.
          </div>
        ) : (
          projects.map((project) => (
            <article key={project.id} className="rounded-2xl border border-jh-earth-200 bg-white p-5 shadow-jh-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-jh-green-950">{project.title}</h2>
                  <p className="text-xs text-jh-earth-600 mt-1">
                    {project.universityName || "University not assigned"}
                  </p>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="rounded-xl bg-jh-earth-50 p-3">
                  <p className="text-[10px] uppercase font-bold text-jh-earth-500 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" /> Sprint Velocity
                  </p>
                  <p className="text-lg font-bold text-jh-green-950">
                    {project.progressPercentage ?? 0}%
                  </p>
                </div>
                <div className="rounded-xl bg-jh-earth-50 p-3">
                  <p className="text-[10px] uppercase font-bold text-jh-earth-500 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> CSR Allocated
                  </p>
                  <p className="text-lg font-bold text-jh-terracotta-700">
                    ₹ {((Number(project.budgetFunded) || 0) / 100000).toFixed(2)} Lakh
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
