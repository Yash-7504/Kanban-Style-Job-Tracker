'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Job, JobStatus, CreateJobData } from '@/types';
import { jobsAPI } from '@/lib/api';
import KanbanColumn from './KanbanColumn';
import JobCard from './JobCard';
import JobModal from './JobModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import PlusIcon from './icons/PlusIcon';
import ThemeToggle from './ThemeToggle';

const statuses: JobStatus[] = ['Applied', 'Interviewing', 'Offer Received', 'Rejected'];

export default function KanbanBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Record<JobStatus, number>>({
    'Applied': 1,
    'Interviewing': 1,
    'Offer Received': 1,
    'Rejected': 1,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; job: Job | null }>({ isOpen: false, job: null });
  const JOBS_PER_PAGE = 3;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find(j => j._id === event.active.id);
    setActiveJob(job || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeJob = jobs.find(j => j._id === activeId);
    const overJob = jobs.find(j => j._id === overId);

    if (!activeJob) return;

    // Dropping over a column
    if (statuses.includes(overId as JobStatus)) {
      const newStatus = overId as JobStatus;
      if (activeJob.status !== newStatus) {
        setJobs(jobs => jobs.map(job => 
          job._id === activeId ? { ...job, status: newStatus } : job
        ));
      }
      return;
    }

    // Dropping over another job
    if (overJob && activeJob.status !== overJob.status) {
      setJobs(jobs => jobs.map(job => 
        job._id === activeId ? { ...job, status: overJob.status } : job
      ));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeJob = jobs.find(j => j._id === activeId);
    if (!activeJob) return;

    // Update job status in database
    try {
      let newStatus = activeJob.status;
      
      if (statuses.includes(overId as JobStatus)) {
        newStatus = overId as JobStatus;
      } else {
        const overJob = jobs.find(j => j._id === overId);
        if (overJob) {
          newStatus = overJob.status;
        }
      }

      if (newStatus !== activeJob.status) {
        await jobsAPI.update(activeJob._id, { status: newStatus });
      }

      // Reorder within the same column
      const activeIndex = jobs.findIndex(j => j._id === activeId);
      const overIndex = jobs.findIndex(j => j._id === overId);

      if (activeIndex !== overIndex) {
        setJobs(jobs => arrayMove(jobs, activeIndex, overIndex));
      }
    } catch (error) {
      console.error('Error updating job:', error);
      fetchJobs(); // Refresh on error
    }
  };

  const handleAddJob = async (data: CreateJobData) => {
    try {
      const response = await jobsAPI.create(data);
      setJobs(jobs => [...jobs, response.data]);
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  const handleEditJob = async (data: CreateJobData) => {
    if (!editingJob) return;
    
    try {
      const response = await jobsAPI.update(editingJob._id, data);
      setJobs(jobs => jobs.map(job => 
        job._id === editingJob._id ? response.data : job
      ));
      setEditingJob(null);
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = (id: string) => {
    const job = jobs.find(j => j._id === id);
    if (job) {
      setDeleteModal({ isOpen: true, job });
    }
  };

  const confirmDeleteJob = async () => {
    if (!deleteModal.job) return;
    
    try {
      await jobsAPI.delete(deleteModal.job._id);
      setJobs(jobs => jobs.filter(job => job._id !== deleteModal.job!._id));
      setDeleteModal({ isOpen: false, job: null });
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const openEditModal = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const getPaginatedJobs = (status: JobStatus) => {
    const statusJobs = jobs.filter(job => job.status === status);
    const startIndex = (currentPage[status] - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    return statusJobs.slice(startIndex, endIndex);
  };

  const getTotalPages = (status: JobStatus) => {
    const statusJobs = jobs.filter(job => job.status === status);
    return Math.ceil(statusJobs.length / JOBS_PER_PAGE);
  };

  const handlePageChange = (status: JobStatus, page: number) => {
    setCurrentPage(prev => ({ ...prev, [status]: page }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-8 animate-fade-in pb-2 sm:pb-4 lg:pb-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Modern Header with Glassmorphism */}
        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 shadow-xl animate-slide-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-bold gradient-text mb-1 sm:mb-2">
                Job Tracker
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm lg:text-base">
                Manage your job applications with ease
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <ThemeToggle />
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center gap-2 group flex-1 sm:flex-initial justify-center"
              >
                <PlusIcon width={18} height={18} color="white" className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Add Job</span>
              </button>
            </div>
          </div>
          
          {/* Stats Bar - Mobile: Horizontal Scroll */}
          <div className="mt-4 sm:mt-6">
            <div className="flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:pb-0">
              {statuses.map((status) => {
                const count = jobs.filter(job => job.status === status).length;
                return (
                  <div key={status} className="bg-white/50 dark:bg-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-4 backdrop-blur-sm flex-shrink-0 min-w-[120px] sm:min-w-0">
                    <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{count}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">{status}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Mobile: Vertical Stack */}
          <div className="block sm:hidden space-y-4">
            {statuses.map((status, index) => (
              <div
                key={status}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <KanbanColumn
                  status={status}
                  jobs={getPaginatedJobs(status)}
                  totalJobs={jobs.filter(job => job.status === status).length}
                  currentPage={currentPage[status]}
                  totalPages={getTotalPages(status)}
                  onPageChange={(page) => handlePageChange(status, page)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteJob}
                />
              </div>
            ))}
          </div>
          
          {/* Tablet: 2x2 Grid */}
          <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4">
            {statuses.map((status, index) => (
              <div
                key={status}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <KanbanColumn
                  status={status}
                  jobs={getPaginatedJobs(status)}
                  totalJobs={jobs.filter(job => job.status === status).length}
                  currentPage={currentPage[status]}
                  totalPages={getTotalPages(status)}
                  onPageChange={(page) => handlePageChange(status, page)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteJob}
                />
              </div>
            ))}
          </div>
          
          {/* Desktop: 4 Columns */}
          <div className="hidden lg:grid grid-cols-4 gap-6">
            {statuses.map((status, index) => (
              <div
                key={status}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <KanbanColumn
                  status={status}
                  jobs={getPaginatedJobs(status)}
                  totalJobs={jobs.filter(job => job.status === status).length}
                  currentPage={currentPage[status]}
                  totalPages={getTotalPages(status)}
                  onPageChange={(page) => handlePageChange(status, page)}
                  onEdit={openEditModal}
                  onDelete={handleDeleteJob}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeJob ? (
              <div className="opacity-90 rotate-3 scale-105">
                <JobCard
                  job={activeJob}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        <JobModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={editingJob ? handleEditJob : handleAddJob}
          job={editingJob}
        />
        
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, job: null })}
          onConfirm={confirmDeleteJob}
          jobTitle={deleteModal.job?.role || ''}
          companyName={deleteModal.job?.company || ''}
        />
      </div>
    </div>
  );
}