import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const COMPANIES_SERVICE = process.env.MICROSERVICE_COMPANIES_URL || 'http://localhost:3002';
const COURSES_SERVICE = process.env.MICROSERVICE_COURSES_URL || 'http://localhost:3001';

router.get('/:id/detalhes', async (req, res) => {
  try {
    const { id } = req.params;

    const [companyResponse, coursesResponse] = await Promise.all([
      fetch(`${COMPANIES_SERVICE}/companies/${id}`),
      fetch(`${COURSES_SERVICE}/courses?owner_company_id=${id}`)
    ]);

    if (!companyResponse.ok) {
      return res.status(companyResponse.status).json({ error: 'Company not found' });
    }

    const company = await companyResponse.json();
    const courses = coursesResponse.ok ? await coursesResponse.json() : [];

    res.json({
      company,
      courses,
      totalCourses: courses.length
    });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${COMPANIES_SERVICE}/companies`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COMPANIES_SERVICE}/companies/${req.params.id}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: 'Company not found' });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

router.post('/', async (req, res) => {
  try {
    const response = await fetch(`${COMPANIES_SERVICE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COMPANIES_SERVICE}/companies/${req.params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const response = await fetch(`${COMPANIES_SERVICE}/companies/${req.params.id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      return res.status(204).send();
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error deleting company:', error);
    res.status(500).json({ error: 'Failed to delete company' });
  }
});

export default router;
