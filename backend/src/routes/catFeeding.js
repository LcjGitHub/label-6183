import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { cat_nickname } = req.query;
  let records;
  if (cat_nickname) {
    records = db
      .prepare(
        'SELECT * FROM cat_feeding_records WHERE cat_nickname = ? ORDER BY feeding_date DESC, id DESC'
      )
      .all(cat_nickname);
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
  const { cat_nickname, feeding_date, food_type, quantity, remark } = req.body;
  if (!cat_nickname || !feeding_date || !food_type || !quantity) {
    return res
      .status(400)
      .json({ error: '猫咪昵称、投喂日期、食物类型、投喂量均为必填' });
  }
  const result = db
    .prepare(
      'INSERT INTO cat_feeding_records (cat_nickname, feeding_date, food_type, quantity, remark) VALUES (?, ?, ?, ?, ?)'
    )
    .run(cat_nickname, feeding_date, food_type, quantity, remark ?? null);
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
