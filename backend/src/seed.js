import db from './db.js';

/**
 * 若数据库为空则写入 4 条投喂记录示例数据
 */
export function seedIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM feeding_records').get().n;
  if (count > 0) return;

  const insertRecord = db.prepare(`
    INSERT INTO feeding_records (feeding_date, location, cat_food_type, quantity, remark)
    VALUES (?, ?, ?, ?, ?)
  `);

  const records = [
    {
      feeding_date: '2026-06-10',
      location: '社区南门花坛边',
      cat_food_type: '伟嘉成猫粮',
      quantity: '约 150 克（一小碗）',
      remark: '橘猫吃得很快，三花猫在旁边观望，等橘猫吃完才过来',
    },
    {
      feeding_date: '2026-06-12',
      location: '3 号楼地下车库入口',
      cat_food_type: '皇家室内猫粮',
      quantity: '约 100 克',
      remark: '只有黑猫出现，比较警惕，放好粮后退到远处它才过来吃',
    },
    {
      feeding_date: '2026-06-15',
      location: '小区中心喷泉旁长椅下',
      cat_food_type: '自制猫饭（鸡胸肉+南瓜）',
      quantity: '约 200 克，分装两小盘',
      remark: '两只白猫一起过来吃，相处很和谐，吃完还舔了会儿毛',
    },
    {
      feeding_date: '2026-06-17',
      location: '北门快递柜旁草地',
      cat_food_type: '妙鲜包（金枪鱼味）',
      quantity: '2 袋（每袋 85 克）',
      remark: '碰到一位阿姨也在喂猫，聊了一会儿，她每天早上都会来',
    },
  ];

  db.exec('BEGIN');
  try {
    for (const r of records) {
      insertRecord.run(r.feeding_date, r.location, r.cat_food_type, r.quantity, r.remark);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log('已写入 seed 数据：4 条投喂记录示例');
}
