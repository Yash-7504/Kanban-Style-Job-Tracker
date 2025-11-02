import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';
import jobRoutes from './routes/jobs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ message: 'Server is running!', database: 'Connected' });
  } catch (error) {
    res.status(500).json({ message: 'Server is running!', database: 'Disconnected', error });
  }
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Database connection will be established on first request');
});