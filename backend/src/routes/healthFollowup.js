import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const records = db
    .prepare(
      'SELECT * FROM health_followups ORDER BY followup_date DESC, id DESC'
    )
    .all();
  res.json(records);
});

router.get('/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM health_followups WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: '随访记录不存在' });
  }
  res.json(record);
});

router.post('/', (req, res) => {
  const { cat_nickname, followup_date, weight, mental_status, went_doctor, remark } = req.body;
  if (!cat_nickname || !followup_date || weight === undefined || !mental_status) {
    return res
      .status(400)
      .json({ error: '猫咪昵称、随访日期、体重、精神状态均为必填' });
  }
  const result = db
    .prepare(
      'INSERT INTO health_followups (cat_nickname, followup_date, weight, mental_status, went_doctor, remark) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(
      cat_nickname,
      followup_date,
      weight,
      mental_status,
      went_doctor ? 1 : 0,
      remark ?? null
    );
  const record = db
    .prepare('SELECT * FROM health_followups WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(record);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM health_followups WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '随访记录不存在' });
  }
  const { cat_nickname, followup_date, weight, mental_status, went_doctor, remark } = req.body;
  db.prepare(
    `UPDATE health_followups
     SET cat_nickname = ?, followup_date = ?, weight = ?, mental_status = ?, went_doctor = ?, remark = ?
     WHERE id = ?`
  ).run(
    cat_nickname ?? existing.cat_nickname,
    followup_date ?? existing.followup_date,
    weight ?? existing.weight,
    mental_status ?? existing.mental_status,
    went_doctor !== undefined ? (went_doctor ? 1 : 0) : existing.went_doctor,
    remark ?? existing.remark,
    req.params.id
  );
  const record = db.prepare('SELECT * FROM health_followups WHERE id = ?').get(req.params.id);
  res.json(record);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM health_followups WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '随访记录不存在' });
  }
  db.prepare('DELETE FROM health_followups WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
