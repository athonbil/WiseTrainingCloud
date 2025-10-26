import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { course_id, group_id, status } = req.query;

    let query = supabase.from('enrollments').select('*');

    if (course_id) {
      query = query.eq('course_id', course_id);
    }

    if (group_id) {
      query = query.eq('group_id', group_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('enrolled_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { course_id, group_id } = req.body;

    if (!course_id || !group_id) {
      return res.status(400).json({ error: 'course_id and group_id are required' });
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert({
        course_id,
        group_id,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating enrollment:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['active', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('enrollments')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('enrollments')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
