import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import companiesRouter from './routes/companies.js';
import coursesRouter from './routes/courses.js';
import enrollmentsRouter from './routes/enrollments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'WiseTraining BFF' });
});

app.use('/api/empresas', companiesRouter);
app.use('/api/cursos', coursesRouter);
app.use('/api/enrollments', enrollmentsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`BFF running on port ${PORT}`);
});
