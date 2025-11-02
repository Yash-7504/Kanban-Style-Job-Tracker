'use client';

import { useState, useEffect } from 'react';
import type { Job, JobStatus, CreateJobData } from '@/types';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateJobData) => void;
  job?: Job | null;
}

const statuses: JobStatus[] = ['Applied', 'Interviewing', 'Offer Received', 'Rejected'];

export default function JobModal({ isOpen, onClose, onSave, job }: JobModalProps) {
  const [formData, setFormData] = useState<CreateJobData>({
    company: '',
    role: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        role: job.role,
        status: job.status,
        dateApplied: job.dateApplied.split('T')[0],
      });
    } else {
      setFormData({
        company: '',
        role: '',
        status: 'Applied',
        dateApplied: new Date().toISOString().split('T')[0],
      });
    }
  }, [job, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in max-h-[90vh] overflow-visible relative">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {job ? 'Edit Job Application' : 'Add New Job'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            {job ? 'Update your job application details' : 'Track a new job opportunity'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Company Name
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="e.g., Google, Microsoft"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Job Role
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="e.g., Frontend Developer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    formData.status === status
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Date Applied
            </label>
            <input
              type="date"
              required
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              {job ? 'Update' : 'Add'} Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}