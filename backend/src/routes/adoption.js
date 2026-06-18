import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (_req, res) => {
  const records = db
    .prepare(
      'SELECT * FROM adoption_intentions ORDER BY application_date DESC, id DESC'
    )
    .all();
  res.json(records);
});

router.get('/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM adoption_intentions WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: '领养意向不存在' });
  }
  res.json(record);
});

router.post('/', (req, res) => {
  const { applicant_name, phone, cat_nickname, application_date, application_status, remark } = req.body;
  if (!applicant_name || !phone || !cat_nickname || !application_date) {
    return res
      .status(400)
      .json({ error: '申请人姓名、联系电话、意向猫咪昵称、申请日期均为必填' });
  }
  const result = db
    .prepare(
      'INSERT INTO adoption_intentions (applicant_name, phone, cat_nickname, application_date, application_status, remark) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(applicant_name, phone, cat_nickname, application_date, application_status ?? '待审核', remark ?? null);
  const record = db
    .prepare('SELECT * FROM adoption_intentions WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(record);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM adoption_intentions WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '领养意向不存在' });
  }
  const { applicant_name, phone, cat_nickname, application_date, application_status, remark } = req.body;
  db.prepare(
    `UPDATE adoption_intentions
     SET applicant_name = ?, phone = ?, cat_nickname = ?, application_date = ?, application_status = ?, remark = ?
     WHERE id = ?`
  ).run(
    applicant_name ?? existing.applicant_name,
    phone ?? existing.phone,
    cat_nickname ?? existing.cat_nickname,
    application_date ?? existing.application_date,
    application_status ?? existing.application_status,
    remark ?? existing.remark,
    req.params.id
  );
  const record = db.prepare('SELECT * FROM adoption_intentions WHERE id = ?').get(req.params.id);
  res.json(record);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM adoption_intentions WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '领养意向不存在' });
  }
  db.prepare('DELETE FROM adoption_intentions WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
