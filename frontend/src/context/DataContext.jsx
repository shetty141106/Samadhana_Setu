import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { issueApi } from '../api/issue.api';
import { projectApi } from '../api/project.api';
import { industryApi } from '../api/industry.api';
import { dashboardApi } from '../api/dashboard.api';

const DataContext = createContext(null);
const LIVE_API = import.meta.env.VITE_ENABLE_LIVE_API === 'true';
const projectToUi = project => ({ ...project, status: String(project.status || 'PLANNED').toLowerCase(), kanbanTasks: project.kanbanTasks || [], milestones: project.milestones || [], teamMembers: project.teamMembers || [], progressPercentage: Number(project.progressPercentage ?? 0) });

export const DataProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [stats, setStats] = useState({});
  const [dashboard, setDashboard] = useState(null);
  const [likedIssueIds, setLikedIssueIds] = useState(new Set());
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  useEffect(() => {
    const storageKey = currentUser?.id ? `samadhansetu_upvotes_${currentUser.id}` : null;
    if (!storageKey) { setLikedIssueIds(new Set()); return; }
    try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); setLikedIssueIds(new Set(Array.isArray(saved) ? saved.map(String) : [])); } catch { setLikedIssueIds(new Set()); }
  }, [currentUser?.id]);

  useEffect(() => {
    if (!LIVE_API || !isAuthenticated) {
      setIssues([]); setProjects([]); setSponsors([]); setDashboard(null); setStats({}); setDataLoading(false); setDataError(''); return;
    }
    let cancelled = false;
    (async () => {
      setDataLoading(true); setDataError('');
      try {
        const role = String(currentUser?.role || '').trim().toLowerCase();
        const isCitizen = role === 'citizen';
        const canReadOperationalIssues = role === 'admin' || role === 'nodal';
        const isIndustry = role === 'industry';
        const issuePromise = isCitizen && currentUser?.id ? issueApi.getCitizenIssues(currentUser.id) : canReadOperationalIssues ? issueApi.listIssues() : Promise.resolve([]);
        const [loadedIssues, loadedProjects] = await Promise.all([issuePromise, projectApi.listProjectsWithDetails()]);
        if (cancelled) return;
        setIssues(Array.isArray(loadedIssues) ? loadedIssues : []);
        setProjects(Array.isArray(loadedProjects) ? loadedProjects.map(projectToUi) : []);
        if (role === 'admin' || role === 'nodal') { try { setDashboard(await dashboardApi.getSummary()); } catch { setDashboard(null); } }
        if (isIndustry || role === 'admin') { try { setSponsors(await industryApi.listSponsorships()); } catch { setSponsors([]); } }
        else setSponsors([]);
      } catch (error) { if (!cancelled) setDataError(error.message || 'Unable to load live platform data.'); }
      finally { if (!cancelled) setDataLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, currentUser?.id, currentUser?.role]);

  const addIssue = async newIssue => {
    if (!isAuthenticated) throw new Error('Live API authentication is required to create an issue.');
    const created = await issueApi.createIssue(newIssue);
    const uiIssue = { ...created, category: newIssue.category, categoryLabel: newIssue.categoryLabel, district: newIssue.district, submittedBy: `${currentUser.name} (Citizen)`, images: created.images?.length ? created.images : (newIssue.images || []) };
    setIssues(prev => [uiIssue, ...prev]); return uiIssue;
  };

  const upvoteIssue = id => {
    const issueKey = String(id); const storageKey = currentUser?.id ? `samadhansetu_upvotes_${currentUser.id}` : null;
    if (!storageKey) return false;
    try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); const savedIds = Array.isArray(saved) ? saved.map(String) : []; if (savedIds.includes(issueKey)) return false; const nextIds = [...savedIds, issueKey]; localStorage.setItem(storageKey, JSON.stringify(nextIds)); setLikedIssueIds(new Set(nextIds)); } catch { return false; }
    setIssues(prev => prev.map(i => i.id === id ? { ...i, upvotes: Number(i.upvotes || 0) + 1 } : i)); return true;
  };

  const verifyIssue = async (id, { status, priority, nodalRemarks, assignedUniversity }) => {
    if (!LIVE_API || !isAuthenticated) throw new Error('Live API authentication is required.');
    let updated = null;
    if (status) { updated = await issueApi.updateIssueStatus(id, status); setIssues(prev => prev.map(i => i.id === id ? { ...i, ...updated, nodalRemarks: nodalRemarks || i.nodalRemarks, assignedUniversity: assignedUniversity || i.assignedUniversity } : i)); }
    if (priority) { updated = await issueApi.updateIssuePriority(id, priority); setIssues(prev => prev.map(i => i.id === id ? { ...i, ...updated, nodalRemarks: nodalRemarks || i.nodalRemarks, assignedUniversity: assignedUniversity || i.assignedUniversity } : i)); }
    return updated;
  };

  const updateTaskStatus = async (projectId, taskId, newStatus) => { const project = projects.find(p => p.id === projectId); const task = project?.kanbanTasks?.find(t => t.id === taskId); if (!task) return null; const updated = await projectApi.updateTask(taskId, { title: task.title, description: task.description || '', dueDate: task.dueDate, status: newStatus.toUpperCase(), milestoneId: task.milestoneId, assignedToId: task.assignedToId }); setProjects(prev => prev.map(p => p.id === projectId ? { ...p, kanbanTasks: p.kanbanTasks.map(t => t.id === taskId ? { ...t, ...updated } : t) } : p)); return updated; };
  const addKanbanTask = async (projectId, taskData) => { const created = await projectApi.createTask(projectId, { title: taskData.title, description: taskData.description || '', dueDate: taskData.dueDate, status: 'TODO', milestoneId: taskData.milestoneId, assignedToId: taskData.assignedToId }); setProjects(prev => prev.map(p => p.id === projectId ? { ...p, kanbanTasks: [...(p.kanbanTasks || []), created] } : p)); return created; };
  const sponsorProject = async (projectId, amount, sponsorName, organizationId) => { if (!organizationId) throw new Error('No verified industry organization is available for this account.'); const created = await industryApi.createSponsorship({ organizationId, projectId, amount: Number(amount), status: 'PENDING' }); setSponsors(prev => [created, ...prev]); return created; };
  const updateMilestone = async (projectId, index, newStatus) => { const milestone = projects.find(p => p.id === projectId)?.milestones?.[index]; if (!milestone?.id) return null; const updated = await projectApi.updateMilestone(milestone.id, { title: milestone.title, startDate: milestone.startDate, endDate: milestone.endDate, status: newStatus.toUpperCase() }); setProjects(prev => prev.map(p => p.id === projectId ? { ...p, milestones: p.milestones.map((m, i) => i === index ? updated : m) } : p)); return updated; };
  const refreshIssues = async () => { if (!LIVE_API || !isAuthenticated) return; const role = String(currentUser?.role || '').trim().toLowerCase(); const loaded = role === 'citizen' ? await issueApi.getCitizenIssues(currentUser.id) : role === 'admin' || role === 'nodal' ? await issueApi.listIssues() : []; setIssues(Array.isArray(loaded) ? loaded : []); };

  return <DataContext.Provider value={{ issues, projects, sponsors, stats, dashboard, dataLoading, dataError, liveApi: LIVE_API, addIssue, upvoteIssue, likedIssueIds, isIssueLiked: id => likedIssueIds.has(String(id)), verifyIssue, updateTaskStatus, addKanbanTask, sponsorProject, updateMilestone, refreshIssues }}>{children}</DataContext.Provider>;
};
export const useData = () => { const context = useContext(DataContext); if (!context) throw new Error('useData must be used within DataProvider'); return context; };
