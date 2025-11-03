import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// GET /api/profile/:id
router.get('/profile/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid user id.' });
  }
  try {
    const [[user]] = await pool.query(
      `SELECT id, name, email, role, bio, city, skills, interests, current_badge, cis, created_at
       FROM users WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Convert comma-separated strings into arrays for the UI
    const skills = typeof user.skills === 'string' && user.skills.trim().length > 0
      ? user.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    const interests = typeof user.interests === 'string' && user.interests.trim().length > 0
      ? user.interests.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    return res.json({
      success: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio || '',
      city: user.city || '',
      skills,
      interests,
      current_badge: user.current_badge || null,
      cis: user.cis || 0,
      created_at: user.created_at,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Profile fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// PUT /api/profile/update/:id
router.put('/profile/update/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid user id.' });
  }
  const { bio = '', city = '', skills = [], interests = [] } = req.body || {};
  try {
    const [[user]] = await pool.query('SELECT id FROM users WHERE id = ? LIMIT 1', [id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const skillsStr = Array.isArray(skills) ? skills.join(', ') : '';
    const interestsStr = Array.isArray(interests) ? interests.join(', ') : '';
    await pool.query(
      `UPDATE users SET bio = ?, city = ?, skills = ?, interests = ? WHERE id = ?`,
      [String(bio), String(city), skillsStr, interestsStr, id]
    );
    return res.json({ success: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Profile update error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Minimal metrics endpoints to satisfy frontend calls
router.get('/dashboard/volunteer/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid user id.' });
  }
  return res.json({ success: true, metrics: { totalHours: 0, upcomingProjects: 0 } });
});

router.get('/dashboard/ngo/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid user id.' });
  }
  return res.json({ success: true, metrics: { campaigns: 0, volunteers: 0, fundsRaised: 0 } });
});

export default router;
