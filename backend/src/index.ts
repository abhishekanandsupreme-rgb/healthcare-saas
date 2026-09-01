import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.json({ status: 'ok', database: 'not-connected' });
  }
});

app.get('/api/patients', async (_req, res) => {
  res.json({ message: 'Patients endpoint - implement with DB connection' });
});

app.get('/api/providers', async (_req, res) => {
  res.json({ message: 'Providers endpoint - implement with DB connection' });
});

app.get('/api/appointments', async (_req, res) => {
  res.json({ message: 'Appointments endpoint - implement with DB connection' });
});

app.listen(PORT, () => {
  console.log(`Healthcare SaaS API running on port ${PORT}`);
});