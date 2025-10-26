import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import coursesRouter from './routes/courses.js';
import enrollmentsRouter from './routes/enrollments.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Courses Microservice' });
});

app.use('/courses', coursesRouter);
app.use('/enrollments', enrollmentsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Courses Microservice running on port ${PORT}`);
});
