import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { date } = req.query;
  let sql = 'SELECT * FROM volunteer_schedules';
  let params = [];

  if (date) {
    sql += ' WHERE duty_date = ?';
    params.push(date);
  }

  sql += ' ORDER BY duty_date ASC, id ASC';

  const records = db.prepare(sql).all(...params);
  res.json(records);
});

router.get('/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM volunteer_schedules WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: '排班记录不存在' });
  }
  res.json(record);
});

router.post('/', (req, res) => {
  const { volunteer_name, duty_date, area, phone, is_arrived, remark } = req.body;
  if (!volunteer_name || !duty_date || !area || !phone) {
    return res
      .status(400)
      .json({ error: '志愿者姓名、值班日期、负责区域、联系电话均为必填' });
  }
  const result = db
    .prepare(
      'INSERT INTO volunteer_schedules (volunteer_name, duty_date, area, phone, is_arrived, remark) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(volunteer_name, duty_date, area, phone, is_arrived ?? 0, remark ?? null);
  const record = db
    .prepare('SELECT * FROM volunteer_schedules WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(record);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM volunteer_schedules WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '排班记录不存在' });
  }
  const { volunteer_name, duty_date, area, phone, is_arrived, remark } = req.body;
  db.prepare(
    `UPDATE volunteer_schedules
     SET volunteer_name = ?, duty_date = ?, area = ?, phone = ?, is_arrived = ?, remark = ?
     WHERE id = ?`
  ).run(
    volunteer_name ?? existing.volunteer_name,
    duty_date ?? existing.duty_date,
    area ?? existing.area,
    phone ?? existing.phone,
    is_arrived ?? existing.is_arrived,
    remark ?? existing.remark,
    req.params.id
  );
  const record = db.prepare('SELECT * FROM volunteer_schedules WHERE id = ?').get(req.params.id);
  res.json(record);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM volunteer_schedules WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '排班记录不存在' });
  }
  db.prepare('DELETE FROM volunteer_schedules WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
