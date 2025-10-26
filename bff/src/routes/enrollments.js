import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const COURSES_SERVICE = process.env.MICROSERVICE_COURSES_URL || 'http://localhost:3001';

router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: 'Failed to create enrollment' });
  }
});

router.get('/', async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${COURSES_SERVICE}/enrollments${queryParams ? '?' + queryParams : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/enrollments/${req.params.id}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Enrollment not found' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/enrollments/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/enrollments/${req.params.id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      return res.status(204).send();
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: 'Failed to delete enrollment' });
  }
});

export default router;
