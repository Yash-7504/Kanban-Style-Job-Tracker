import axios from 'axios';
import { Job, CreateJobData, UpdateJobData } from '@/types';

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api`;
  }
  
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
});

export const jobsAPI = {
  getAll: () => api.get<Job[]>('/jobs'),
  create: (data: CreateJobData) => api.post<Job>('/jobs', data),
  update: (id: string, data: Partial<UpdateJobData>) => api.put<Job>(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};