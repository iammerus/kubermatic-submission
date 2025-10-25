import axios from 'axios';
import type {
  LoginRequest,
  LoginResponse,
  Project,
  Cluster,
  Region,
  Version,
  ClusterFormData,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
};

export const clustersApi = {
  getByProject: (projectId: string) =>
    api.get<Cluster[]>(`/projects/${projectId}/clusters`),
  create: (projectId: string, data: ClusterFormData) =>
    api.post<Cluster>(`/projects/${projectId}/clusters`, data),
  update: (clusterId: string, data: Partial<ClusterFormData>) =>
    api.put<Cluster>(`/clusters/${clusterId}`, data),
  delete: (clusterId: string) => api.delete(`/clusters/${clusterId}`),
};

export const referenceApi = {
  getRegions: () => api.get<Region[]>('/regions'),
  getVersions: () => api.get<Version[]>('/versions'),
};

export default api;
