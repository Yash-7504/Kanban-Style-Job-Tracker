import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { formatJobStatus, parseJobStatus } from '../models/Job';

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Format jobs for frontend
    const formattedJobs = jobs.map(job => ({
      ...job,
      _id: job.id,
      status: formatJobStatus(job.status)
    }));
    
    res.json(formattedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

export const createJob = async (req: Request, res: Response) => {
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
};

export const updateJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updateData: any = {};
    if (updates.company) updateData.company = updates.company;
    if (updates.role) updateData.role = updates.role;
    if (updates.status) updateData.status = parseJobStatus(updates.status);
    if (updates.dateApplied) updateData.dateApplied = new Date(updates.dateApplied);
    
    const job = await prisma.job.update({
      where: { id },
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
};

export const deleteJob = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.job.delete({
      where: { id }
    });
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(400).json({ message: 'Error deleting job', error });
  }
};