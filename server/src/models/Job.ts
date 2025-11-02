import { Job as PrismaJob, JobStatus } from '@prisma/client';

export interface IJob extends PrismaJob {}

export { JobStatus };

// Helper function to convert Prisma enum to frontend format
export const formatJobStatus = (status: JobStatus): string => {
  switch (status) {
    case 'APPLIED':
      return 'Applied';
    case 'INTERVIEWING':
      return 'Interviewing';
    case 'OFFER_RECEIVED':
      return 'Offer Received';
    case 'REJECTED':
      return 'Rejected';
    default:
      return 'Applied';
  }
};

// Helper function to convert frontend format to Prisma enum
export const parseJobStatus = (status: string): JobStatus => {
  switch (status) {
    case 'Applied':
      return 'APPLIED';
    case 'Interviewing':
      return 'INTERVIEWING';
    case 'Offer Received':
      return 'OFFER_RECEIVED';
    case 'Rejected':
      return 'REJECTED';
    default:
      return 'APPLIED';
  }
};