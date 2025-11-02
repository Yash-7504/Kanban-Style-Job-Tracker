import { NextApiRequest, NextApiResponse } from 'next';

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ message: 'Server is running!', database: 'Connected' });
    } catch (error) {
      res.status(500).json({ message: 'Server is running!', database: 'Disconnected', error });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}