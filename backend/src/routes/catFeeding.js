import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { cat_sighting_id } = req.query;
  let records;
  if (cat_sighting_id) {
    records = db
      .prepare(
        'SELECT * FROM cat_feeding_records WHERE cat_sighting_id = ? ORDER BY feeding_date DESC, id DESC'
      )
      .all(cat_sighting_id);
  } else {
    records = db
      .prepare('SELECT * FROM cat_feeding_records ORDER BY feeding_date DESC, id DESC')
      .all();
  }
  res.json(records);
});

router.get('/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM cat_feeding_records WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: '投喂记录不存在' });
  }
  res.json(record);
});

router.post('/', (req, res) => {
  const { cat_sighting_id, feeding_date, food_type, quantity, remark } = req.body;
  if (!cat_sighting_id || !feeding_date || !food_type || !quantity) {
    return res
      .status(400)
      .json({ error: '猫咪编号、投喂日期、食物类型、投喂量均为必填' });
  }
  const sighting = db.prepare('SELECT * FROM cat_sightings WHERE id = ?').get(cat_sighting_id);
  if (!sighting) {
    return res.status(404).json({ error: '关联的猫咪不存在' });
  }
  const result = db
    .prepare(
      'INSERT INTO cat_feeding_records (cat_sighting_id, feeding_date, food_type, quantity, remark) VALUES (?, ?, ?, ?, ?)'
    )
    .run(cat_sighting_id, feeding_date, food_type, quantity, remark ?? null);
  const record = db
    .prepare('SELECT * FROM cat_feeding_records WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(record);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM cat_feeding_records WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '投喂记录不存在' });
  }
  db.prepare('DELETE FROM cat_feeding_records WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
