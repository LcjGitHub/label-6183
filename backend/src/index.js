import express from 'express';
import cors from 'cors';
import { initSchema } from './db.js';
import { seedIfEmpty } from './seed.js';
import feedingRouter from './routes/feeding.js';

const PORT = 5000;
const app = express();

app.use(cors());
app.use(express.json());

initSchema();
seedIfEmpty();

app.use('/api/feeding', feedingRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`后端服务运行于 http://localhost:${PORT}`);
});
