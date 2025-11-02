export interface Job {
  _id: string;
  company: string;
  role: string;
  status: JobStatus;
  dateApplied: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = 'Applied' | 'Interviewing' | 'Offer Received' | 'Rejected';

export interface CreateJobData {
  company: string;
  role: string;
  status: JobStatus;
  dateApplied: string;
}

export interface UpdateJobData extends Partial<CreateJobData> {
  _id: string;
}