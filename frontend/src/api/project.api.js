import { apiClient } from './client';

const taskToUi = (task = {}) => ({ ...task, status: String(task.status || 'TODO').toLowerCase() });
const taskToApi = (task = {}) => ({ ...task, status: String(task.status || 'todo').toUpperCase() });

export const mapTaskToUiModel = taskToUi;
export const mapTaskToApiModel = taskToApi;

export const listProjects = () => apiClient.get('/api/projects');
export const getProject = (id) => apiClient.get(`/api/projects/${id}`);
export const listProjectsByUniversity = (universityId) => apiClient.get(`/api/projects/university/${universityId}`);
export const listProjectsByStatus = (status) => apiClient.get(`/api/projects/status/${status}`);
export const createProject = (payload) => apiClient.post('/api/projects', payload);
export const updateProject = (id, payload) => apiClient.put(`/api/projects/${id}`, payload);
export const deleteProject = (id) => apiClient.delete(`/api/projects/${id}`);

export const listTeamMembers = (projectId) => apiClient.get(`/api/projects/${projectId}/team`);
export const addTeamMember = (projectId, payload) => apiClient.post(`/api/projects/${projectId}/team`, payload);
export const removeTeamMember = (memberId) => apiClient.delete(`/api/projects/team/${memberId}`);

export const listTasks = async (projectId) => (await apiClient.get(`/api/projects/${projectId}/tasks`)).map(taskToUi);
export const createTask = async (projectId, payload) => taskToUi(await apiClient.post(`/api/projects/${projectId}/tasks`, taskToApi(payload)));
export const updateTask = async (taskId, payload) => taskToUi(await apiClient.put(`/api/projects/tasks/${taskId}`, taskToApi(payload)));
export const deleteTask = (taskId) => apiClient.delete(`/api/projects/tasks/${taskId}`);

export const listMilestones = (projectId) => apiClient.get(`/api/projects/${projectId}/milestones`);
export const createMilestone = (projectId, payload) => apiClient.post(`/api/projects/${projectId}/milestones`, payload);

export const projectApi = {
  listProjects,
  getProject,
  listProjectsByUniversity,
  listProjectsByStatus,
  createProject,
  updateProject,
  deleteProject,
  listTeamMembers,
  addTeamMember,
  removeTeamMember,
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  listMilestones,
  createMilestone,
  mapTaskToUiModel,
  mapTaskToApiModel
};
