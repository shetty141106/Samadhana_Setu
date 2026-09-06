import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';
import { MapPin, ThumbsUp, Calendar, ArrowRight, Building, School } from 'lucide-react';

export const IssueCard = ({ issue, onSelect, onUpvote }) => {
  return (
    <div className="bg-white rounded-2xl border border-jh-earth-200/90 shadow-jh-soft overflow-hidden hover:shadow-jh-card transition-all duration-200 flex flex-col justify-between group">
      
      {/* Top Image & Category Tag */}
      <div>
        <div className="relative h-44 w-full overflow-hidden bg-jh-earth-200">
          <img
            src={issue.images && issue.images[0] ? issue.images[0] : 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          {/* Status Badge on top-right */}
          <div className="absolute top-3 right-3">
            <StatusBadge status={issue.status} />
          </div>

          {/* District & Location on bottom-left */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-1.5 font-medium drop-shadow-sm">
              <MapPin className="w-3.5 h-3.5 text-jh-terracotta-400" />
              <span className="truncate">{issue.district}</span>
            </div>
            {issue.priority && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                issue.priority === 'Critical' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {issue.priority} Priority
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-jh-terracotta-700 mb-1">
            {issue.categoryLabel || issue.category}
          </div>

          <h4 className="text-base font-bold text-jh-green-950 line-clamp-2 group-hover:text-jh-terracotta-700 transition-colors mb-2">
            {issue.title}
          </h4>

          <p className="text-xs text-jh-earth-700 line-clamp-2 leading-relaxed mb-4">
            {issue.description}
          </p>

          {/* Academic / CSR Assignment metadata */}
          {(issue.assignedUniversity || issue.csrPartner) && (
            <div className="p-2.5 rounded-xl bg-jh-earth-50 border border-jh-earth-200 space-y-1 text-xs mb-3">
              {issue.assignedUniversity && (
                <div className="flex items-center gap-1.5 text-jh-green-900 font-medium">
                  <School className="w-3.5 h-3.5 text-jh-green-700" />
                  <span className="truncate">{issue.assignedUniversity}</span>
                </div>
              )}
              {issue.csrPartner && (
                <div className="flex items-center gap-1.5 text-jh-terracotta-800 font-medium">
                  <Building className="w-3.5 h-3.5 text-jh-terracotta-600" />
                  <span className="truncate">CSR: {issue.csrPartner}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="px-5 py-3.5 bg-jh-earth-50/70 border-t border-jh-earth-100 flex items-center justify-between">
        
        {/* Upvote */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onUpvote) onUpvote(issue.id);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-jh-earth-700 hover:text-jh-green-900 transition-colors"
          title="Support this civic issue"
        >
          <ThumbsUp className="w-3.5 h-3.5 text-jh-green-700" />
          <span>{issue.upvotes}</span>
        </button>

        {/* View Details CTA */}
        <button
          onClick={() => onSelect && onSelect(issue)}
          className="flex items-center gap-1 text-xs font-bold text-jh-green-900 hover:text-jh-terracotta-700 transition-colors"
        >
          <span>View Progress</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
};
