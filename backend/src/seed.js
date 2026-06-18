import db from './db.js';

function seedFeedingRecords() {
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

function seedHealthFollowups() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM health_followups').get().n;
  if (count > 0) return;

  const insertRecord = db.prepare(`
    INSERT INTO health_followups (cat_nickname, followup_date, weight, mental_status, went_doctor, remark)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const records = [
    {
      cat_nickname: '橘胖子',
      followup_date: '2026-06-08',
      weight: 5.2,
      mental_status: '活泼好动',
      went_doctor: 0,
      remark: '食欲很好，毛色光亮，体重较上月增加 0.3kg',
    },
    {
      cat_nickname: '黑炭',
      followup_date: '2026-06-10',
      weight: 3.8,
      mental_status: '精神一般',
      went_doctor: 1,
      remark: '有些打喷嚏，带去宠物医院检查，轻微感冒，开了感冒药，连续吃三天',
    },
    {
      cat_nickname: '花花',
      followup_date: '2026-06-12',
      weight: 4.1,
      mental_status: '活泼好动',
      went_doctor: 0,
      remark: '刚做完绝育手术一周，伤口恢复良好，精神状态不错',
    },
    {
      cat_nickname: '小白',
      followup_date: '2026-06-14',
      weight: 2.9,
      mental_status: '萎靡不振',
      went_doctor: 1,
      remark: '疑似肠胃炎，送医输液治疗，建议住院观察两天',
    },
    {
      cat_nickname: '橘胖子',
      followup_date: '2026-06-16',
      weight: 5.4,
      mental_status: '活泼好动',
      went_doctor: 0,
      remark: '体重继续增长，需要控制饮食，增加运动量',
    },
  ];

  db.exec('BEGIN');
  try {
    for (const r of records) {
      insertRecord.run(r.cat_nickname, r.followup_date, r.weight, r.mental_status, r.went_doctor, r.remark);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log('已写入 seed 数据：5 条健康随访记录示例');
}

/**
 * 若数据库为空则写入种子示例数据
 */
export function seedIfEmpty() {
  seedFeedingRecords();
  seedHealthFollowups();
}
