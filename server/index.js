import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import pool from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'auth', timestamp: Date.now() });
});

// Simple DB connectivity check
app.get('/api/db/ping', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    return res.json({ success: true, rows });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('DB ping error:', err);
    return res.status(500).json({ success: false, code: err && err.code, message: err && (err.sqlMessage || err.message) });
  }
});

app.use('/api/auth', authRouter);
app.use('/api', profileRouter);

// Global error handler to ensure JSON response
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Server error.' });
});

const PORT = 4000; // fixed port, no .env needed
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on http://localhost:${PORT}`);
});


