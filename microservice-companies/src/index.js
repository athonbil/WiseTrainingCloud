import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companiesRouter from './routes/companies.js';
import employeesRouter from './routes/employees.js';
import groupsRouter from './routes/groups.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Companies Microservice' });
});

app.use('/companies', companiesRouter);
app.use('/employees', employeesRouter);
app.use('/groups', groupsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Companies Microservice running on port ${PORT}`);
});
