'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Job } from '@/types';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

export default function JobCard({ job, onEdit, onDelete }: JobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Compare just the date parts, not time
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Generate a consistent color for company initial
  const getCompanyColor = (company: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-emerald-500 to-emerald-600',
      'bg-gradient-to-br from-amber-500 to-amber-600',
      'bg-gradient-to-br from-rose-500 to-rose-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl shadow-md border border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover-lift overflow-hidden transition-all duration-200"
    >
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary-500 to-purple-500"></div>
      
      <div className="p-4">
        {/* Header with company logo and actions */}
        <div className="flex items-start gap-3 mb-3">
          {/* Company Logo Circle */}
          <div className={`w-10 h-10 rounded-xl ${getCompanyColor(job.company)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-white font-bold text-sm">
              {job.company.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base truncate">
              {job.company}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm truncate font-medium">{job.role}</p>
          </div>
          
          {/* Action buttons - Desktop: hover, Mobile: always visible */}
          <div className="hidden sm:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              title="Edit job"
            >
              <EditIcon width={16} height={16} color="#3B82F6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job._id);
              }}
              className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
              title="Delete job"
            >
              <DeleteIcon width={16} height={16} color="#F43F5E" />
            </button>
          </div>
        </div>
        
        {/* Action buttons - Mobile only */}
        <div className="flex gap-2 mb-3 sm:hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(job);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium text-sm"
          >
            <EditIcon width={16} height={16} color="currentColor" />
            <span>Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(job._id);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors font-medium text-sm"
          >
            <DeleteIcon width={16} height={16} color="currentColor" />
            <span>Delete</span>
          </button>
        </div>
        
        {/* Footer with date */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700/50 rounded-lg px-3 py-2 sm:bg-transparent sm:border-t sm:border-slate-100 sm:dark:border-slate-700 sm:rounded-none sm:pt-3 sm:px-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-medium">{formatDate(job.dateApplied)}</span>
        </div>
      </div>
    </div>
  );
}