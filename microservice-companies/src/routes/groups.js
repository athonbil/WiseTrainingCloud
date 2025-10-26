import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { company_id } = req.query;

    let query = supabase.from('groups').select('*');

    if (company_id) {
      query = query.eq('company_id', company_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id/members', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        *,
        employees:employee_id (
          id,
          name,
          email
        )
      `)
      .eq('group_id', req.params.id);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { company_id, name, description } = req.body;

    if (!company_id || !name) {
      return res.status(400).json({ error: 'company_id and name are required' });
    }

    const { data, error } = await supabase
      .from('groups')
      .insert({
        company_id,
        name,
        description: description || ''
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/members', async (req, res) => {
  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ error: 'employee_id is required' });
    }

    const { data, error } = await supabase
      .from('group_members')
      .insert({
        group_id: req.params.id,
        employee_id
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Employee already in this group' });
      }
      throw error;
    }

    res.status(201).json(data);
  } catch (error) {
    console.error('Error adding member to group:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    const { data, error } = await supabase
      .from('groups')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:groupId/members/:memberId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('id', req.params.memberId);

    if (error) throw error;

    res.status(204).send();
  } catch (error) {
    console.error('Error removing member from group:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
