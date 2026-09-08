import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { AIIntelligencePanel } from './AIIntelligencePanel';

export const IssueAIAnalysisModal = ({ issue, isOpen, onClose }) => {
  if (!issue) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Issue Analysis"
      subtitle={`Case #${issue.id} • ${issue.title}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-jh-green-50 border border-jh-green-200 text-xs text-jh-green-950">
          <BrainCircuit className="w-4 h-4 text-jh-green-700" />
          <span>AI analysis is persisted against this exact grievance. Re-analysis is available explicitly from this panel.</span>
        </div>
        <AIIntelligencePanel issue={issue} initialAnalysis={issue.aiAnalysis || null} />
      </div>
    </Modal>
  );
};
