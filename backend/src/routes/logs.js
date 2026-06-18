import { Router } from 'express';
import db from '../db.js';

const router = Router();

/**
 * 获取某只猫的全部观察日志
 */
router.get('/cat/:catId', (req, res) => {
  const cat = db.prepare('SELECT id FROM cats WHERE id = ?').get(req.params.catId);
  if (!cat) {
    return res.status(404).json({ error: '猫咪不存在' });
  }
  const logs = db
    .prepare(
      'SELECT * FROM observation_logs WHERE cat_id = ? ORDER BY observed_at DESC, id DESC'
    )
    .all(req.params.catId);
  res.json(logs);
});

/**
 * 为某只猫新增观察日志
 */
router.post('/cat/:catId', (req, res) => {
  const cat = db.prepare('SELECT id FROM cats WHERE id = ?').get(req.params.catId);
  if (!cat) {
    return res.status(404).json({ error: '猫咪不存在' });
  }
  const { observed_at, content } = req.body;
  if (!observed_at || !content) {
    return res.status(400).json({ error: '日期与内容为必填' });
  }
  const result = db
    .prepare('INSERT INTO observation_logs (cat_id, observed_at, content) VALUES (?, ?, ?)')
    .run(req.params.catId, observed_at, content);
  const log = db.prepare('SELECT * FROM observation_logs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(log);
});

/**
 * 更新观察日志
 */
router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM observation_logs WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '日志不存在' });
  }
  const { observed_at, content } = req.body;
  db.prepare(
    'UPDATE observation_logs SET observed_at = ?, content = ? WHERE id = ?'
  ).run(observed_at ?? existing.observed_at, content ?? existing.content, req.params.id);
  const log = db.prepare('SELECT * FROM observation_logs WHERE id = ?').get(req.params.id);
  res.json(log);
});

/**
 * 删除观察日志
 */
router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM observation_logs WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '日志不存在' });
  }
  db.prepare('DELETE FROM observation_logs WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
