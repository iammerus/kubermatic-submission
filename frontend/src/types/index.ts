export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface Cluster {
  id: string;
  projectId: string;
  name: string;
  region: string;
  version: string;
  nodeCount: number;
  status: 'running' | 'pending' | 'error';
  labels?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Region {
  id: string;
  name: string;
  code: string;
}

export interface Version {
  version: string;
  isDefault: boolean;
  supportStatus: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface ClusterFormData {
  name: string;
  region: string;
  version: string;
  nodeCount: number;
  labels?: Record<string, string>;
}
