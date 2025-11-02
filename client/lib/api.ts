import axios from 'axios';
import { Job, CreateJobData, UpdateJobData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('vercel.app') ? `${window.location.origin}/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: API_URL,
});

export const jobsAPI = {
  getAll: () => api.get<Job[]>('/jobs'),
  create: (data: CreateJobData) => api.post<Job>('/jobs', data),
  update: (id: string, data: Partial<UpdateJobData>) => api.put<Job>(`/jobs/${id}`, data),
  delete: (id: string) => api.delete(`/jobs/${id}`),
};