import { Router } from 'express';
import db from '../db.js';

const router = Router();

/**
 * 获取所有猫咪档案
 */
router.get('/', (_req, res) => {
  const cats = db
    .prepare(
      `SELECT c.*,
        (SELECT COUNT(*) FROM observation_logs WHERE cat_id = c.id) AS log_count
       FROM cats c
       ORDER BY c.id`
    )
    .all();
  res.json(cats);
});

/**
 * 获取单只猫咪详情（含观察日志）
 */
router.get('/:id', (req, res) => {
  const cat = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  if (!cat) {
    return res.status(404).json({ error: '猫咪不存在' });
  }
  const logs = db
    .prepare(
      'SELECT * FROM observation_logs WHERE cat_id = ? ORDER BY observed_at DESC, id DESC'
    )
    .all(cat.id);
  res.json({ ...cat, logs });
});

/**
 * 新建猫咪档案
 */
router.post('/', (req, res) => {
  const { nickname, fur_color, location, personality } = req.body;
  if (!nickname || !fur_color || !location || !personality) {
    return res.status(400).json({ error: '昵称、毛色、地点、性格均为必填' });
  }
  const result = db
    .prepare(
      'INSERT INTO cats (nickname, fur_color, location, personality) VALUES (?, ?, ?, ?)'
    )
    .run(nickname, fur_color, location, personality);
  const cat = db.prepare('SELECT * FROM cats WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(cat);
});

/**
 * 更新猫咪档案
 */
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '猫咪不存在' });
  }
  const { nickname, fur_color, location, personality } = req.body;
  db.prepare(
    `UPDATE cats SET nickname = ?, fur_color = ?, location = ?, personality = ?
     WHERE id = ?`
  ).run(
    nickname ?? existing.nickname,
    fur_color ?? existing.fur_color,
    location ?? existing.location,
    personality ?? existing.personality,
    req.params.id
  );
  const cat = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  res.json(cat);
});

/**
 * 删除猫咪档案（级联删除观察日志）
 */
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM cats WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '猫咪不存在' });
  }
  db.prepare('DELETE FROM cats WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
