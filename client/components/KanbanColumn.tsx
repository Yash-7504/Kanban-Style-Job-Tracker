'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Job, JobStatus } from '@/types';
import JobCard from './JobCard';

interface KanbanColumnProps {
  status: JobStatus;
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  'Applied': {
    gradient: 'from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40',
    textColor: 'text-blue-800 dark:text-blue-200',
    borderColor: 'border-blue-400 dark:border-blue-500',
  },
  'Interviewing': {
    gradient: 'from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40',
    textColor: 'text-amber-800 dark:text-amber-200',
    borderColor: 'border-amber-400 dark:border-amber-500',
  },
  'Offer Received': {
    gradient: 'from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40',
    textColor: 'text-emerald-800 dark:text-emerald-200',
    borderColor: 'border-emerald-400 dark:border-emerald-500',
  },
  'Rejected': {
    gradient: 'from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/40',
    textColor: 'text-rose-800 dark:text-rose-200',
    borderColor: 'border-rose-400 dark:border-rose-500',
  },
};

export default function KanbanColumn({ status, jobs, totalJobs, currentPage, totalPages, onPageChange, onEdit, onDelete }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const config = statusConfig[status];

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div className={`rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 border-l-4 bg-gradient-to-br ${config.gradient} ${config.borderColor} shadow-md`}>
        <div className="flex items-center justify-between">
          <h2 className={`font-display font-bold ${config.textColor} text-base sm:text-lg`}>
            {status}
          </h2>
          <span className={`${config.textColor} bg-white/80 dark:bg-slate-800/80 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold`}>
            {totalJobs}
          </span>
        </div>
      </div>
      
      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 glass rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all duration-200 ${
          isOver ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-slate-900 bg-primary-50/50 dark:bg-primary-900/20' : ''
        }`}
      >
        <div className="space-y-2 sm:space-y-3 min-h-[200px] sm:min-h-[400px]">
          <SortableContext items={jobs.map(job => job._id)} strategy={verticalListSortingStrategy}>
            {jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                <p className="text-sm">No jobs yet</p>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </SortableContext>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-200 dark:border-slate-600">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 text-xs bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              ←
            </button>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 text-xs bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}