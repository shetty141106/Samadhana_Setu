import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_ISSUES, INITIAL_PROJECTS, PLATFORM_STATS, MOCK_CSR_SPONSORS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { issueApi } from '../api/issue.api';
import { projectApi } from '../api/project.api';
import { industryApi } from '../api/industry.api';
import { dashboardApi } from '../api/dashboard.api';

const DataContext = createContext(null);
const LIVE_API = import.meta.env.VITE_ENABLE_LIVE_API === 'true';

const projectToUi = (project = {}) => ({
  ...project,
  status: String(project.status || 'PLANNED').toLowerCase(),
  kanbanTasks: project.kanbanTasks || [],
  milestones: project.milestones || [],
  teamMembers: project.teamMembers || [],
  progressPercentage: Number(project.progressPercentage ?? 0)
});

export const DataProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [sponsors, setSponsors] = useState(MOCK_CSR_SPONSORS);
  const [stats, setStats] = useState(PLATFORM_STATS);
  const [dashboard, setDashboard] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    if (!LIVE_API || !isAuthenticated) return;
    let cancelled = false;
    const load = async () => {
      setDataLoading(true); setDataError('');
      try {
        const isCitizen = currentUser?.id && currentUser.role === 'citizen';
        const [loadedIssues, loadedProjects] = await Promise.all([
          isCitizen ? issueApi.getCitizenIssues(currentUser.id) : issueApi.listIssues(),
          projectApi.listProjectsWithDetails()
        ]);
        if (cancelled) return;
        setIssues(loadedIssues);
        setProjects(loadedProjects.map(projectToUi));
        if (currentUser?.role === 'admin' || currentUser?.role === 'nodal_officer') {
          try { setDashboard(await dashboardApi.getSummary()); } catch { /* optional dashboard */ }
        }
        try { setSponsors(await industryApi.listSponsorships()); } catch { /* optional CSR data */ }
      } catch (error) {
        if (!cancelled) setDataError(error.message || 'Unable to load live platform data. Showing available data.');
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, currentUser?.id, currentUser?.role]);

  const addIssue = async (newIssue) => {
    if (LIVE_API && isAuthenticated) {
      const created = await issueApi.createIssue(newIssue);
      const uiIssue = { ...created, category: newIssue.category, categoryLabel: newIssue.categoryLabel, district: newIssue.district, submittedBy: `${currentUser.name} (Citizen)`, images: newIssue.images || [] };
      setIssues(prev => [uiIssue, ...prev]);
      return uiIssue;
    }
    const issueWithId = { id: `JH-ISSUE-2025-${String(issues.length + 120).padStart(3, '0')}`, reportedDate: new Date().toISOString().split('T')[0], status: 'SUBMITTED', upvotes: 1, timeline: [{ status: 'SUBMITTED', date: new Date().toISOString().split('T')[0], remark: 'Grievance registered with evidence by citizen' }], ...newIssue };
    setIssues(prev => [issueWithId, ...prev]);
    setStats(prev => ({ ...prev, totalIssuesReported: prev.totalIssuesReported + 1 }));
    return issueWithId;
  };

  const upvoteIssue = (id) => setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, upvotes: Number(issue.upvotes || 0) + 1 } : issue));

  const verifyIssue = async (id, { status, priority, nodalRemarks, assignedUniversity }) => {
    if (LIVE_API && isAuthenticated) {
      let updated;
      if (status) updated = await issueApi.updateIssueStatus(id, status);
      if (priority) updated = await issueApi.updateIssuePriority(id, priority);
      if (updated) setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, ...updated, nodalRemarks: nodalRemarks || issue.nodalRemarks, assignedUniversity: assignedUniversity || issue.assignedUniversity } : issue));
      return updated;
    }
    setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status, priority: priority || issue.priority, nodalRemarks: nodalRemarks || issue.nodalRemarks, assignedUniversity: assignedUniversity || issue.assignedUniversity, timeline: [...(issue.timeline || []), { status, date: new Date().toISOString().split('T')[0], remark: nodalRemarks || `Status updated to ${status} by Nodal Officer` }] } : issue));
  };

  const updateTaskStatus = async (projectId, taskId, newStatus) => {
    if (LIVE_API && isAuthenticated) {
      const project = projects.find(p => p.id === projectId);
      const task = project?.kanbanTasks?.find(t => t.id === taskId);
      if (task) {
        const updated = await projectApi.updateTask(taskId, { title: task.title, description: task.description || '', dueDate: task.dueDate, status: newStatus.toUpperCase(), milestoneId: task.milestoneId, assignedToId: task.assignedToId });
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, kanbanTasks: p.kanbanTasks.map(t => t.id === taskId ? { ...t, ...updated } : t) } : p));
        return updated;
      }
    }
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, kanbanTasks: p.kanbanTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t) } : p));
  };

  const addKanbanTask = async (projectId, taskData) => {
    if (LIVE_API && isAuthenticated) {
      const created = await projectApi.createTask(projectId, { title: taskData.title, description: taskData.description || '', dueDate: taskData.dueDate, status: 'TODO', milestoneId: taskData.milestoneId, assignedToId: taskData.assignedToId });
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, kanbanTasks: [...(p.kanbanTasks || []), created] } : p));
      return created;
    }
    const created = { id: `TSK-${Math.floor(100 + Math.random() * 900)}`, status: 'todo', ...taskData };
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, kanbanTasks: [...(p.kanbanTasks || []), created] } : p));
    return created;
  };

  const sponsorProject = async (projectId, amount, sponsorName, organizationId) => {
    if (LIVE_API && isAuthenticated) {
      const created = await industryApi.createSponsorship({ organizationId, projectId, amount: Number(amount), status: 'PENDING' });
      setSponsors(prev => [created, ...prev]);
      return created;
    }
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, budgetFunded: Number(p.budgetFunded || 0) + Number(amount), sponsor: sponsorName || p.sponsor, stage: Number(p.budgetFunded || 0) + Number(amount) >= Number(p.budgetTotal || 0) ? 'Fully Funded' : 'CSR Funded' } : p));
  };

  const updateMilestone = async (projectId, index, newStatus) => {
    // The current backend exposes milestone creation but no milestone-status update route.
    // Keep the UI optimistic and preserve the operation for the future update endpoint.
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const milestones = [...(p.milestones || [])];
      if (milestones[index]) milestones[index] = { ...milestones[index], status: newStatus };
      return { ...p, milestones };
    }));
  };

  const refreshIssues = async () => {
    if (!LIVE_API || !isAuthenticated) return;
    const loaded = currentUser?.id && currentUser.role === 'citizen' ? await issueApi.getCitizenIssues(currentUser.id) : await issueApi.listIssues();
    setIssues(loaded);
  };

  return <DataContext.Provider value={{ issues, projects, sponsors, stats, dashboard, dataLoading, dataError, liveApi: LIVE_API, addIssue, upvoteIssue, verifyIssue, updateTaskStatus, addKanbanTask, sponsorProject, updateMilestone, refreshIssues }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
