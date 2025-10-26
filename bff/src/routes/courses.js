import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const COURSES_SERVICE = process.env.MICROSERVICE_COURSES_URL || 'http://localhost:3001';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

router.post('/', async (req, res) => {
  try {
    const functionUrl = `${SUPABASE_URL}/functions/v1/create-course-trigger`;

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.get('/', async (req, res) => {
  try {
    const queryParams = new URLSearchParams(req.query).toString();
    const url = `${COURSES_SERVICE}/courses${queryParams ? '?' + queryParams : ''}`;

    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/courses/${req.params.id}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Course not found' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/courses/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COURSES_SERVICE}/courses/${req.params.id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      return res.status(204).send();
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
