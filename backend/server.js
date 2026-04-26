import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import moodsRouter from './routes/moods.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/moods', moodsRouter);

app.use((error, _req, res, _next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ message: 'Internal server error.' });
});

app.listen(port, () => {
  console.log(`Mood tracker API running on http://localhost:${port}`);
});
