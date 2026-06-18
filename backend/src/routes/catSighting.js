import { Router } from 'express';
import db from '../db.js';

const router = Router();

router.get('/coat-colors', (req, res) => {
  const rows = db
    .prepare(
      "SELECT DISTINCT coat_color FROM cat_sightings WHERE coat_color IS NOT NULL AND coat_color != '' ORDER BY coat_color"
    )
    .all();
  const colors = rows.map((r) => r.coat_color);
  res.json(colors);
});

router.get('/', (req, res) => {
  const { keyword, coat_color } = req.query;
  let records;
  const conditions = [];
  const params = [];

  if (keyword && typeof keyword === 'string' && keyword.trim()) {
    const searchTerm = `%${keyword.trim()}%`;
    conditions.push('(cat_nickname LIKE ? OR location_description LIKE ?)');
    params.push(searchTerm, searchTerm);
  }

  if (coat_color && typeof coat_color === 'string' && coat_color.trim()) {
    conditions.push('coat_color = ?');
    params.push(coat_color.trim());
  }

  if (conditions.length > 0) {
    const whereClause = 'WHERE ' + conditions.join(' AND ');
    records = db
      .prepare(
        `SELECT * FROM cat_sightings ${whereClause} ORDER BY sighting_time DESC, id DESC`
      )
      .all(...params);
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
  const { cat_nickname, latitude, longitude, sighting_time, location_description, photo_url, coat_color } = req.body;
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
      'INSERT INTO cat_sightings (cat_nickname, latitude, longitude, sighting_time, location_description, photo_url, coat_color) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .run(cat_nickname, lat, lng, sighting_time, location_description, photo_url ?? null, coat_color ?? null);
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
  const { cat_nickname, latitude, longitude, sighting_time, location_description, photo_url, coat_color } = req.body;
  const lat = latitude !== undefined ? Number(latitude) : existing.latitude;
  const lng = longitude !== undefined ? Number(longitude) : existing.longitude;
  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    return res.status(400).json({ error: '纬度和经度必须是数字' });
  }
  db.prepare(
    `UPDATE cat_sightings
     SET cat_nickname = ?, latitude = ?, longitude = ?, sighting_time = ?, location_description = ?, photo_url = ?, coat_color = ?
     WHERE id = ?`
  ).run(
    cat_nickname ?? existing.cat_nickname,
    lat,
    lng,
    sighting_time ?? existing.sighting_time,
    location_description ?? existing.location_description,
    photo_url !== undefined ? photo_url : existing.photo_url,
    coat_color !== undefined ? coat_color : existing.coat_color,
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
