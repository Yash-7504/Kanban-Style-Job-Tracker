import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

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

const parseJobStatus = (status: string): string => {
  switch (status) {
    case 'Applied': return 'APPLIED';
    case 'Interviewing': return 'INTERVIEWING';
    case 'Offer Received': return 'OFFER_RECEIVED';
    case 'Rejected': return 'REJECTED';
    default: return 'APPLIED';
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      const updateData: any = {};
      
      if (updates.company) updateData.company = updates.company;
      if (updates.role) updateData.role = updates.role;
      if (updates.status) updateData.status = parseJobStatus(updates.status);
      if (updates.dateApplied) updateData.dateApplied = new Date(updates.dateApplied);
      
      const job = await prisma.job.update({
        where: { id: id as string },
        data: updateData
      });
      
      const formattedJob = {
        ...job,
        _id: job.id,
        status: formatJobStatus(job.status)
      };
      
      res.json(formattedJob);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(400).json({ message: 'Error updating job', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.job.delete({
        where: { id: id as string }
      });
      
      res.json({ message: 'Job deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Job not found' });
      }
      res.status(400).json({ message: 'Error deleting job', error });
    }
  } else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}