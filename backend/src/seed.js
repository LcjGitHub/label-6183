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
function seedCatSightings() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM cat_sightings').get().n;
  if (count > 0) return;

  const insertRecord = db.prepare(`
    INSERT INTO cat_sightings (cat_nickname, latitude, longitude, sighting_time, location_description)
    VALUES (?, ?, ?, ?, ?)
  `);

  const records = [
    {
      cat_nickname: '橘座',
      latitude: 39.9042,
      longitude: 116.4074,
      sighting_time: '2026-06-10 08:30:00',
      location_description: '社区南门花坛边，橘色大猫正在晒太阳',
    },
    {
      cat_nickname: '小黑',
      latitude: 39.9125,
      longitude: 116.3913,
      sighting_time: '2026-06-12 19:15:00',
      location_description: '3号楼地下车库入口旁，黑色短毛猫躲在车底',
    },
    {
      cat_nickname: '三花',
      latitude: 39.9088,
      longitude: 116.4156,
      sighting_time: '2026-06-14 07:00:00',
      location_description: '小区中心喷泉旁长椅下，三花猫在舔毛',
    },
    {
      cat_nickname: '小白',
      latitude: 39.9021,
      longitude: 116.4203,
      sighting_time: '2026-06-16 18:45:00',
      location_description: '北门快递柜旁草地，白色长毛猫独自徘徊',
    },
  ];

  db.exec('BEGIN');
  try {
    for (const r of records) {
      insertRecord.run(r.cat_nickname, r.latitude, r.longitude, r.sighting_time, r.location_description);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log('已写入 seed 数据：4 条目击标注示例');
}

function seedAdoptionIntentions() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM adoption_intentions').get().n;
  if (count > 0) return;

  const insertRecord = db.prepare(`
    INSERT INTO adoption_intentions (applicant_name, phone, cat_nickname, application_date, application_status, remark)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const records = [
    {
      applicant_name: '张小明',
      phone: '13812345678',
      cat_nickname: '橘胖子',
      application_date: '2026-06-10',
      application_status: '待审核',
      remark: '家里有独立阳台，之前养过猫，有养猫经验，希望能给橘胖子一个温暖的家',
    },
    {
      applicant_name: '李小红',
      phone: '13987654321',
      cat_nickname: '花花',
      application_date: '2026-06-12',
      application_status: '已通过',
      remark: '已完成家访，居住环境良好，已预约绝育手术和疫苗接种，下周末接猫',
    },
    {
      applicant_name: '王大伟',
      phone: '13566668888',
      cat_nickname: '黑炭',
      application_date: '2026-06-15',
      application_status: '已拒绝',
      remark: '目前租住的房子不允许养宠物，建议等以后有稳定住所再申请',
    },
  ];

  db.exec('BEGIN');
  try {
    for (const r of records) {
      insertRecord.run(r.applicant_name, r.phone, r.cat_nickname, r.application_date, r.application_status, r.remark);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log('已写入 seed 数据：3 条领养意向示例');
}

function seedVolunteerSchedules() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM volunteer_schedules').get().n;
  if (count > 0) return;

  const insertRecord = db.prepare(`
    INSERT INTO volunteer_schedules (volunteer_name, duty_date, area, phone, is_arrived, remark)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const records = [
    {
      volunteer_name: '张小明',
      duty_date: '2026-06-18',
      area: '社区北门',
      phone: '13812345678',
      is_arrived: 1,
      remark: '早班，负责北门投喂点',
    },
    {
      volunteer_name: '李小红',
      duty_date: '2026-06-18',
      area: '中心花园',
      phone: '13987654321',
      is_arrived: 1,
      remark: '下午班，检查猫咪健康状况',
    },
    {
      volunteer_name: '王大伟',
      duty_date: '2026-06-19',
      area: '3号楼区域',
      phone: '13566668888',
      is_arrived: 0,
      remark: null,
    },
    {
      volunteer_name: '赵丽丽',
      duty_date: '2026-06-19',
      area: '南门花坛',
      phone: '13699990000',
      is_arrived: 0,
      remark: '周末值班，带新志愿者熟悉环境',
    },
    {
      volunteer_name: '陈小强',
      duty_date: '2026-06-20',
      area: '地下车库',
      phone: '13711112222',
      is_arrived: 0,
      remark: null,
    },
  ];

  db.exec('BEGIN');
  try {
    for (const r of records) {
      insertRecord.run(r.volunteer_name, r.duty_date, r.area, r.phone, r.is_arrived, r.remark);
    }
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  console.log('已写入 seed 数据：5 条志愿者排班示例');
}

export function seedIfEmpty() {
  seedFeedingRecords();
  seedHealthFollowups();
  seedCatSightings();
  seedAdoptionIntentions();
  seedVolunteerSchedules();
}
