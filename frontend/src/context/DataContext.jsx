import React, { createContext, useContext, useEffect, useState } from 'react';
import { INITIAL_ISSUES, INITIAL_PROJECTS, PLATFORM_STATS, MOCK_CSR_SPONSORS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { issueApi } from '../api/issue.api';
import { universityApi } from '../api/university.api';
import { projectApi } from '../api/project.api';

const DataContext = createContext(null);
const LIVE_API = import.meta.env.VITE_ENABLE_LIVE_API === 'true';

export const DataProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [universities, setUniversities] = useState([]);
  const [sponsors, setSponsors] = useState(MOCK_CSR_SPONSORS);
  const [stats, setStats] = useState(PLATFORM_STATS);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    if (!LIVE_API || !isAuthenticated) return;
    let cancelled = false;
    const loadLiveData = async () => {
      setDataLoading(true); setDataError('');
      try {
        const issuePromise = currentUser?.id && currentUser.role === 'citizen' ? issueApi.getCitizenIssues(currentUser.id) : issueApi.listIssues();
        const [loadedIssues, loadedProjects, loadedUniversities] = await Promise.all([
          issuePromise,
          projectApi.listProjectsWithDetails(),
          universityApi.listUniversities()
        ]);
        if (!cancelled) {
          setIssues(loadedIssues);
          setProjects(loadedProjects);
          setUniversities(loadedUniversities);
        }
      } catch (error) {
        if (!cancelled) setDataError(error.message || 'Unable to load live platform data.');
      } finally {
        if (!cancelled) setDataLoading(false);
      }
    };
    loadLiveData();
    return () => { cancelled = true; };
  }, [isAuthenticated, currentUser?.id, currentUser?.role]);

  const routeIssueToUniversities = async (category) => {
    if (!LIVE_API) return [];
    return universityApi.routeIssueToUniversities(category);
  };

  const addIssue = async (newIssue) => {
    if (LIVE_API && isAuthenticated) {
      const created = await issueApi.createIssue(newIssue);
      setIssues(prev => [{ ...created, category: newIssue.category, categoryLabel: newIssue.categoryLabel, district: newIssue.district, submittedBy: `${currentUser.name} (Citizen)`, images: newIssue.images || [] }, ...prev]);
      return created;
    }
    const issueWithId = { id: `JH-ISSUE-2025-${String(issues.length + 120).padStart(3, '0')}`, reportedDate: new Date().toISOString().split('T')[0], status: 'SUBMITTED', upvotes: 1, timeline: [{ status: 'SUBMITTED', date: new Date().toISOString().split('T')[0], remark: 'Grievance registered with evidence by citizen' }], ...newIssue };
    setIssues(prev => [issueWithId, ...prev]);
    setStats(prev => ({ ...prev, totalIssuesReported: prev.totalIssuesReported + 1 }));
    return issueWithId;
  };

  const upvoteIssue = (id) => setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue));

  const verifyIssue = async (id, { status, priority, nodalRemarks, assignedUniversity }) => {
    if (LIVE_API && isAuthenticated) {
      const requests = [];
      if (status) requests.push(issueApi.updateIssueStatus(id, status));
      if (priority) requests.push(issueApi.updateIssuePriority(id, priority));
      const results = await Promise.all(requests);
      const updated = results[results.length - 1];
      if (updated) setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, ...updated, nodalRemarks, assignedUniversity } : issue));
      return updated;
    }
    setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status, priority: priority || issue.priority, nodalRemarks: nodalRemarks || issue.nodalRemarks, assignedUniversity: assignedUniversity || issue.assignedUniversity, timeline: [...(issue.timeline || []), { status, date: new Date().toISOString().split('T')[0], remark: nodalRemarks || `Status updated to ${status} by Nodal Officer` }] } : issue));
  };

  const updateTaskStatus = (projectId, taskId, newStatus) => setProjects(prev => prev.map(prj => prj.id === projectId ? { ...prj, kanbanTasks: prj.kanbanTasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t) } : prj));
  const addKanbanTask = (projectId, taskData) => setProjects(prev => prev.map(prj => prj.id === projectId ? { ...prj, kanbanTasks: [...prj.kanbanTasks, { id: `TSK-${Math.floor(100 + Math.random() * 900)}`, status: 'todo', ...taskData }] } : prj));
  const sponsorProject = (projectId, amount, sponsorName) => setProjects(prev => prev.map(prj => prj.id === projectId ? { ...prj, budgetFunded: prj.budgetFunded + Number(amount), sponsor: sponsorName || prj.sponsor, stage: prj.budgetFunded + Number(amount) >= prj.budgetTotal ? 'Fully Funded' : 'CSR Funded' } : prj));
  const updateMilestone = (projectId, index, newStatus) => setProjects(prev => prev.map(prj => { if (prj.id !== projectId) return prj; const milestones = [...prj.milestones]; if (milestones[index]) milestones[index] = { ...milestones[index], status: newStatus }; return { ...prj, milestones }; }));

  return <DataContext.Provider value={{ issues, projects, universities, sponsors, stats, dataLoading, dataError, addIssue, upvoteIssue, verifyIssue, updateTaskStatus, addKanbanTask, sponsorProject, updateMilestone, routeIssueToUniversities }}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
