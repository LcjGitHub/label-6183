import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const { keyword } = req.query;
  let records;
  if (keyword && typeof keyword === 'string' && keyword.trim()) {
    const searchTerm = `%${keyword.trim()}%`;
    records = db
      .prepare(
        'SELECT * FROM cat_sightings WHERE cat_nickname LIKE ? OR location_description LIKE ? ORDER BY sighting_time DESC, id DESC'
      )
      .all(searchTerm, searchTerm);
  } else {
    records = db
      .prepare(
        'SELECT * FROM cat_sightings ORDER BY sighting_time DESC, id DESC'
      )
      .all();
  }
  res.json(records);
});

router.get('/:id', (req, res) => {
  const record = db.prepare('SELECT * FROM cat_sightings WHERE id = ?').get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: '目击标注不存在' });
  }
  res.json(record);
});

router.post('/', (req, res) => {
  const { cat_nickname, latitude, longitude, sighting_time, location_description } = req.body;
  if (!cat_nickname || latitude === undefined || longitude === undefined || !sighting_time || !location_description) {
    return res
      .status(400)
      .json({ error: '猫咪昵称、纬度、经度、发现时间、地点描述均为必填' });
  }
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: '纬度和经度必须是数字' });
  }
  const result = db
    .prepare(
      'INSERT INTO cat_sightings (cat_nickname, latitude, longitude, sighting_time, location_description) VALUES (?, ?, ?, ?, ?)'
    )
    .run(cat_nickname, lat, lng, sighting_time, location_description);
  const record = db
    .prepare('SELECT * FROM cat_sightings WHERE id = ?')
    .get(result.lastInsertRowid);
  res.status(201).json(record);
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM cat_sightings WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '目击标注不存在' });
  }
  const { cat_nickname, latitude, longitude, sighting_time, location_description } = req.body;
  const lat = latitude !== undefined ? Number(latitude) : existing.latitude;
  const lng = longitude !== undefined ? Number(longitude) : existing.longitude;
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: '纬度和经度必须是数字' });
  }
  db.prepare(
    `UPDATE cat_sightings
     SET cat_nickname = ?, latitude = ?, longitude = ?, sighting_time = ?, location_description = ?
     WHERE id = ?`
  ).run(
    cat_nickname ?? existing.cat_nickname,
    lat,
    lng,
    sighting_time ?? existing.sighting_time,
    location_description ?? existing.location_description,
    req.params.id
  );
  const record = db.prepare('SELECT * FROM cat_sightings WHERE id = ?').get(req.params.id);
  res.json(record);
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM cat_sightings WHERE id = ?').get(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: '目击标注不存在' });
  }
  db.prepare('DELETE FROM cat_sightings WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

export default router;
