import express from 'express';
import cors from 'cors';
import { initSchema } from './db.js';
import { seedIfEmpty } from './seed.js';
import catsRouter from './routes/cats.js';
import logsRouter from './routes/logs.js';

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

initSchema();
seedIfEmpty();

app.use('/api/cats', catsRouter);
app.use('/api/logs', logsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`后端服务运行于 http://localhost:${PORT}`);
});
