import React from "react";
import { BrainCircuit } from "lucide-react";
import { Modal } from "../ui/Modal";
import { AIIntelligencePanel } from "./AIIntelligencePanel";

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
        <AIIntelligencePanel
          issue={issue}
          initialAnalysis={issue.aiAnalysis || null}
        />
      </div>
    </Modal>
  );
};
