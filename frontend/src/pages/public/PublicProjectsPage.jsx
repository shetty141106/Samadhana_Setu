import React, { useEffect, useState } from "react";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { projectApi } from "../../api/project.api";
import { Button } from "../../components/ui/Button";

export const PublicProjectsPage = ({ onNavigate }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    projectApi
      .listPublicProjects()
      .then((items) => {
        if (!cancelled) setProjects(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load projects right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-jh-earth-50 text-jh-charcoal">
      <section className="bg-jh-green-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => onNavigate("landing")}
            className="text-xs text-jh-earth-200 hover:text-white mb-6"
          >
            ← Back to home
          </button>
          <p className="text-xs uppercase tracking-wider font-bold text-jh-gold-400 mb-2">
            SamadhanSetu Projects
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Explore R&D Projects
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-jh-earth-200 leading-relaxed">
            Browse projects submitted through the platform.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="py-16 text-center text-sm text-jh-earth-600">
            Loading projects...
          </div>
        ) : error ? (
          <div className="py-16 text-center text-sm text-red-700">{error}</div>
        ) : projects.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-jh-earth-300 text-sm text-jh-earth-600">
            No R&D projects are available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <article
                  key={project.id}
                  className="bg-white rounded-2xl border border-jh-earth-200 shadow-jh-soft p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-jh-terracotta-700 bg-jh-terracotta-50 px-2 py-0.5 rounded-md border border-jh-terracotta-200">
                      R&D Project
                    </span>
                    <span className="text-xs font-bold text-jh-green-900 bg-jh-green-100 px-2.5 py-0.5 rounded-full">
                      {String(project.status || "PLANNED").replaceAll("_", " ")}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-jh-green-950 mb-2">
                    {project.title || "Untitled Project"}
                  </h2>
                  <p className="text-xs text-jh-earth-700 line-clamp-3 mb-3">
                    {project.description || "No project description provided."}
                  </p>

                  <div className="space-y-2 text-xs text-jh-earth-800 bg-jh-earth-50 p-3 rounded-xl border border-jh-earth-200 mb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-jh-green-800" />
                      <span className="truncate">
                        {project.universityName || "University not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-jh-terracotta-600" />
                      <span>
                        {project.teamSize || 0} team members ·{" "}
                        {project.milestoneCount || 0} milestones ·{" "}
                        {project.taskCount || 0} tasks
                      </span>
                    </div>
                  </div>

                  <div className="mt-auto pt-3 border-t border-jh-earth-200 text-[11px] text-jh-earth-500">
                    View-only project summary
                  </div>
                </article>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-xs text-jh-earth-600 mb-3">
            Want to participate, research, or fund a project?
          </p>
          <Button
            variant="secondary"
            size="md"
            icon={ArrowRight}
            onClick={() => onNavigate("login")}
          >
            Sign in to participate
          </Button>
        </div>
      </main>
    </div>
  );
};
