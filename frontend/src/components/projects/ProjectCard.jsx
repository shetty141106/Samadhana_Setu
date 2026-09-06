import React from 'react';
import { School, UserCheck, Coins, Award, ArrowRight, Target } from 'lucide-react';
import { Button } from '../ui/Button';

export const ProjectCard = ({ project, onSelect, onSponsorClick }) => {
  const fundingPercent = Math.min(100, Math.round((project.budgetFunded / project.budgetTotal) * 100));

  return (
    <div className="bg-white rounded-2xl border border-jh-earth-200/90 shadow-jh-soft p-5 md:p-6 hover:shadow-jh-card transition-all duration-200 flex flex-col justify-between">
      
      <div>
        {/* Domain & Stage */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-jh-terracotta-700 bg-jh-terracotta-50 px-2 py-0.5 rounded-md border border-jh-terracotta-200">
            {project.domain}
          </span>
          <span className="text-xs font-bold text-jh-green-900 bg-jh-green-100 px-2.5 py-0.5 rounded-full">
            {project.stage}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-jh-green-950 line-clamp-2 mb-2">
          {project.title}
        </h4>

        {/* SDG Target */}
        {project.sdgGoal && (
          <div className="flex items-center gap-1.5 text-xs text-jh-earth-700 mb-3">
            <Target className="w-3.5 h-3.5 text-jh-green-700 flex-shrink-0" />
            <span className="truncate">{project.sdgGoal}</span>
          </div>
        )}

        {/* University & Mentor */}
        <div className="space-y-1.5 text-xs text-jh-earth-800 bg-jh-earth-50 p-3 rounded-xl border border-jh-earth-200 mb-4">
          <div className="flex items-center gap-2 font-medium text-jh-green-950">
            <School className="w-4 h-4 text-jh-green-800 flex-shrink-0" />
            <span className="truncate">{project.university}</span>
          </div>
          <div className="flex items-center gap-2 text-jh-earth-700">
            <UserCheck className="w-4 h-4 text-jh-terracotta-600 flex-shrink-0" />
            <span className="truncate">Mentor: {project.facultyMentor}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-jh-earth-600 font-medium">Research Milestone Velocity:</span>
            <span className="font-bold text-jh-green-900">{project.progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-jh-earth-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-jh-green-700 rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* CSR Funding Stats */}
        <div className="pt-3 border-t border-jh-earth-200 grid grid-cols-2 gap-2 text-xs mb-2">
          <div>
            <span className="text-[10px] uppercase text-jh-earth-500 block">Total Budget</span>
            <span className="font-bold text-jh-charcoal">₹ {(project.budgetTotal / 100000).toFixed(2)} Lakh</span>
          </div>
          <div>
            <span className="text-[10px] uppercase text-jh-earth-500 block">CSR Backing</span>
            <span className="font-bold text-jh-terracotta-700">₹ {(project.budgetFunded / 100000).toFixed(2)} Lakh ({fundingPercent}%)</span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-jh-earth-100 flex items-center justify-between gap-2">
        {onSponsorClick ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            icon={Coins}
            onClick={() => onSponsorClick(project)}
          >
            Pledge CSR Grant
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            icon={ArrowRight}
            onClick={() => onSelect && onSelect(project)}
          >
            Open Workspace & Kanban
          </Button>
        )}
      </div>

    </div>
  );
};
