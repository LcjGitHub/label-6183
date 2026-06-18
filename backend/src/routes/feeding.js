import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const records = db
    .prepare(
      'SELECT * FROM feeding_records ORDER BY feeding_date DESC, id DESC'
    )
    .all();
  res.json(records);
});

router.get('/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM feeding_records WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: '投喂记录不存在' });
  }
  res.json(record);
});

const WEATHER_OPTIONS = ['晴天', '阴天', '雨天', '雪天'];

router.post('/', (req, res) => {
  const { feeding_date, location, cat_food_type, quantity, weather, remark } = req.body;
  if (!feeding_date || !location || !cat_food_type || !quantity) {
    return res
      .status(400)
      .json({ error: '投喂日期、投喂地点、猫粮种类、投喂量均为必填' });
  }
  if (weather && !WEATHER_OPTIONS.includes(weather)) {
    return res.status(400).json({ error: '天气值无效，可选：晴天、阴天、雨天、雪天' });
  }
  const result = db
    .prepare(
      'INSERT INTO feeding_records (feeding_date, location, cat_food_type, quantity, weather, remark) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(feeding_date, location, cat_food_type, quantity, weather ?? null, remark ?? null);
  const record = db
    .prepare('SELECT * FROM feeding_records WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(record);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM feeding_records WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '投喂记录不存在' });
  }
  const { feeding_date, location, cat_food_type, quantity, weather, remark } = req.body;
  if (weather && !WEATHER_OPTIONS.includes(weather)) {
    return res.status(400).json({ error: '天气值无效，可选：晴天、阴天、雨天、雪天' });
  }
  db.prepare(
    `UPDATE feeding_records
     SET feeding_date = ?, location = ?, cat_food_type = ?, quantity = ?, weather = ?, remark = ?
     WHERE id = ?`
  ).run(
    feeding_date ?? existing.feeding_date,
    location ?? existing.location,
    cat_food_type ?? existing.cat_food_type,
    quantity ?? existing.quantity,
    weather !== undefined ? weather : existing.weather,
    remark ?? existing.remark,
    req.params.id
  );
  const record = db.prepare('SELECT * FROM feeding_records WHERE id = ?').get(req.params.id);
  res.json(record);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM feeding_records WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '投喂记录不存在' });
  }
  db.prepare('DELETE FROM feeding_records WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
