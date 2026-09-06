import React, { createContext, useContext, useState } from 'react';
import { INITIAL_ISSUES, INITIAL_PROJECTS, PLATFORM_STATS, MOCK_CSR_SPONSORS } from '../data/mockData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [sponsors, setSponsors] = useState(MOCK_CSR_SPONSORS);
  const [stats, setStats] = useState(PLATFORM_STATS);

  // Citizen adds issue
  const addIssue = (newIssue) => {
    const issueWithId = {
      id: `JH-ISSUE-2025-${String(issues.length + 120).padStart(3, '0')}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
      upvotes: 1,
      timeline: [
        {
          status: 'SUBMITTED',
          date: new Date().toISOString().split('T')[0],
          remark: 'Grievance registered with evidence by citizen'
        }
      ],
      ...newIssue
    };
    setIssues(prev => [issueWithId, ...prev]);
    setStats(prev => ({
      ...prev,
      totalIssuesReported: prev.totalIssuesReported + 1
    }));
    return issueWithId;
  };

  // Upvote issue
  const upvoteIssue = (id) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue
    ));
  };

  // Nodal officer verifies or updates issue
  const verifyIssue = (id, { status, priority, nodalRemarks, assignedUniversity }) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === id) {
        const updatedTimeline = [
          ...issue.timeline,
          {
            status,
            date: new Date().toISOString().split('T')[0],
            remark: nodalRemarks || `Status updated to ${status} by Nodal Officer`
          }
        ];
        return {
          ...issue,
          status,
          priority: priority || issue.priority,
          nodalRemarks: nodalRemarks || issue.nodalRemarks,
          assignedUniversity: assignedUniversity || issue.assignedUniversity,
          timeline: updatedTimeline
        };
      }
      return issue;
    }));
  };

  // Update Kanban task status (Student/Faculty)
  const updateTaskStatus = (projectId, taskId, newStatus) => {
    setProjects(prev => prev.map(prj => {
      if (prj.id === projectId) {
        const updatedTasks = prj.kanbanTasks.map(t => 
          t.id === taskId ? { ...t, status: newStatus } : t
        );
        const doneCount = updatedTasks.filter(t => t.status === 'done').length;
        const calcProgress = Math.round((doneCount / updatedTasks.length) * 100);
        return {
          ...prj,
          kanbanTasks: updatedTasks,
          progressPercentage: calcProgress
        };
      }
      return prj;
    }));
  };

  // Add Kanban Task
  const addKanbanTask = (projectId, taskData) => {
    setProjects(prev => prev.map(prj => {
      if (prj.id === projectId) {
        const newTask = {
          id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
          status: 'todo',
          ...taskData
        };
        const updatedTasks = [...prj.kanbanTasks, newTask];
        return {
          ...prj,
          kanbanTasks: updatedTasks
        };
      }
      return prj;
    }));
  };

  // Industry CSR Sponsorship Pledge
  const sponsorProject = (projectId, amount, sponsorName) => {
    setProjects(prev => prev.map(prj => {
      if (prj.id === projectId) {
        const newFunded = prj.budgetFunded + Number(amount);
        const newStage = newFunded >= prj.budgetTotal ? 'Fully Funded' : 'CSR Funded';
        return {
          ...prj,
          budgetFunded: newFunded,
          sponsor: sponsorName || prj.sponsor,
          stage: newStage
        };
      }
      return prj;
    }));
  };

  // Faculty updates milestone status
  const updateMilestone = (projectId, index, newStatus) => {
    setProjects(prev => prev.map(prj => {
      if (prj.id === projectId) {
        const updatedMilestones = [...prj.milestones];
        if (updatedMilestones[index]) {
          updatedMilestones[index] = { ...updatedMilestones[index], status: newStatus };
        }
        return { ...prj, milestones: updatedMilestones };
      }
      return prj;
    }));
  };

  return (
    <DataContext.Provider
      value={{
        issues,
        projects,
        sponsors,
        stats,
        addIssue,
        upvoteIssue,
        verifyIssue,
        updateTaskStatus,
        addKanbanTask,
        sponsorProject,
        updateMilestone
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
