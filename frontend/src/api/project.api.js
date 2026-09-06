import { apiClient } from './client';

const taskToUi = (task = {}) => ({ ...task, status: String(task.status || 'TODO').toLowerCase() });
const taskToApi = (task = {}) => ({ ...task, status: String(task.status || 'todo').toUpperCase() });

export const mapTaskToUiModel = taskToUi;
export const mapTaskToApiModel = taskToApi;

export const listProjects = async () => (await apiClient.get('/api/projects')).map(p => ({ ...p, tasks: (p.tasks || []).map(taskToUi) }));
export const getProject = async (id) => { const p = await apiClient.get(`/api/projects/${id}`); return { ...p, tasks: (p.tasks || []).map(taskToUi) }; };
export const createProject = (payload) => apiClient.post('/api/projects', payload);
export const updateProject = (id, payload) => apiClient.put(`/api/projects/${id}`, payload);
export const deleteProject = (id) => apiClient.delete(`/api/projects/${id}`);

export const listTasks = async (projectId) => (await apiClient.get(`/api/tasks/project/${projectId}`)).map(taskToUi);
export const createTask = async (payload) => taskToUi(await apiClient.post('/api/tasks', taskToApi(payload)));
export const updateTask = async (id, payload) => taskToUi(await apiClient.put(`/api/tasks/${id}`, taskToApi(payload)));
export const updateTaskStatus = async (id, status) => taskToUi(await apiClient.patch(`/api/tasks/${id}/status?status=${encodeURIComponent(String(status).toUpperCase())}`));
export const deleteTask = (id) => apiClient.delete(`/api/tasks/${id}`);

export const listMilestones = (projectId) => apiClient.get(`/api/milestones/project/${projectId}`);
export const createMilestone = (projectId, payload) => apiClient.post(`/api/projects/${projectId}/milestones`, payload);
export const updateMilestone = (id, payload) => apiClient.put(`/api/milestones/${id}`, payload);

export const projectApi = {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  listTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  listMilestones,
  createMilestone,
  updateMilestone,
  mapTaskToUiModel,
  mapTaskToApiModel
};
