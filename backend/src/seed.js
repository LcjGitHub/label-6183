import db from './db.js';

/**
 * 若数据库为空则写入 3 只猫及各自 3 条观察日志
 */
export function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM cats').get().n;
  if (count > 0) return;

  const insertCat = db.prepare(`
    INSERT INTO cats (nickname, fur_color, location, personality)
    VALUES (?, ?, ?, ?)
  `);

  const insertLog = db.prepare(`
    INSERT INTO observation_logs (cat_id, observed_at, content)
    VALUES (?, ?, ?)
  `);

  const cats = [
    {
      nickname: '橘座',
      fur_color: '橘色虎斑',
      location: '社区南门花坛',
      personality: '亲人、贪吃，见人就蹭腿',
      logs: [
        { observed_at: '2026-03-01', content: '在花坛边晒太阳，对路人很友好。' },
        { observed_at: '2026-03-08', content: '有人投喂猫粮，吃得很快，尾巴竖得笔直。' },
        { observed_at: '2026-03-15', content: '和一只白猫并排躺着，疑似在交朋友。' },
      ],
    },
    {
      nickname: '煤球',
      fur_color: '纯黑',
      location: '地下车库入口',
      personality: '警惕、夜行，保持距离',
      logs: [
        { observed_at: '2026-02-20', content: '深夜独自巡逻车库，听到脚步声立刻躲进阴影。' },
        { observed_at: '2026-03-05', content: '白天罕见露面，在墙角舔毛，约五分钟后离开。' },
        { observed_at: '2026-03-12', content: '捕获到一只小老鼠，叼走后消失在通风口。' },
      ],
    },
    {
      nickname: '三花',
      fur_color: '三花（白/橘/黑）',
      location: '小区中心喷泉旁',
      personality: '慵懒、爱睡觉，偶尔伸懒腰',
      logs: [
        { observed_at: '2026-02-28', content: '趴在喷泉石沿上睡了整个下午。' },
        { observed_at: '2026-03-10', content: '被小孩惊扰后挪到长椅下继续睡。' },
        { observed_at: '2026-03-18', content: '雨后出来舔毛，毛色在湿光下格外漂亮。' },
      ],
    },
  ];

  db.exec('BEGIN');
  try {
    for (const cat of cats) {
      const { logs, ...catData } = cat;
      const result = insertCat.run(
        catData.nickname,
        catData.fur_color,
        catData.location,
        catData.personality
      );
      const catId = result.lastInsertRowid;
      for (const log of logs) {
        insertLog.run(catId, log.observed_at, log.content);
      }
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log('已写入 seed 数据：3 只猫，各 3 条观察日志');
}
