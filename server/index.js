import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'auth', timestamp: Date.now() });
});

app.use('/api/auth', authRouter);

const PORT = 4000; // fixed port, no .env needed
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Auth server listening on http://localhost:${PORT}`);
});


