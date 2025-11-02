import { NextApiRequest, NextApiResponse } from 'next';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formatJobStatus = (status: string): string => {
  switch (status) {
    case 'APPLIED': return 'Applied';
    case 'INTERVIEWING': return 'Interviewing';
    case 'OFFER_RECEIVED': return 'Offer Received';
    case 'REJECTED': return 'Rejected';
    default: return 'Applied';
  }
};

const parseJobStatus = (status: string) => {
  switch (status) {
    case 'Applied': return 'APPLIED' as const;
    case 'Interviewing': return 'INTERVIEWING' as const;
    case 'Offer Received': return 'OFFER_RECEIVED' as const;
    case 'Rejected': return 'REJECTED' as const;
    default: return 'APPLIED' as const;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method === 'GET') {
    try {
      const jobs = await prisma.job.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      const formattedJobs = jobs.map((job: any) => ({
        ...job,
        _id: job.id,
        status: formatJobStatus(job.status)
      }));
      
      res.json(formattedJobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching jobs', error });
    }
  } else if (req.method === 'POST') {
    try {
      const { company, role, status, dateApplied } = req.body;
      
      const job = await prisma.job.create({
        data: {
          company,
          role,
          status: parseJobStatus(status),
          dateApplied: new Date(dateApplied),
        }
      });
      
      const formattedJob = {
        ...job,
        _id: job.id,
        status: formatJobStatus(job.status)
      };
      
      res.status(201).json(formattedJob);
    } catch (error) {
      res.status(400).json({ message: 'Error creating job', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}