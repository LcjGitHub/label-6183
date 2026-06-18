# 流浪猫目击地图标注

社区流浪猫管理系统，包含流浪猫目击地图标注、投喂记录和健康随访三大功能模块。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + Mantine + zustand + axios（端口 **5101**） |
| 后端 | Express + SQLite（`backend/data/feeding.db`，端口 **5000**，使用 Node 内置 `node:sqlite`） |

## 快速启动

### 1. 后端（一条命令）

```bash
cd backend && npm install && npm start
```

服务地址：`http://localhost:5000`

首次启动会自动创建数据库。

开发时可用热重载：

```bash
cd backend && npm run dev
```

### 2. 前端（一条命令）

另开一个终端：

```bash
cd frontend && npm install && npm run dev
```

浏览器访问：`http://localhost:5101`

## 功能模块

### 🗺️ 流浪猫目击地图

- **标注列表**：卡片展示所有目击标注，显示猫咪昵称、坐标、发现时间、地点描述预览
- **标注详情**：完整展示全部字段，包含经纬度坐标，提供「在地图中查看」外链跳转 OpenStreetMap，支持编辑和删除
- **基础 CRUD**：标注点的增删改查

### 🍽️ 投喂记录

- **投喂记录列表**：日期、地点、猫粮种类、投喂量、备注预览
- **单条详情**：完整展示记录全部字段，支持编辑和删除
- **基础 CRUD**：投喂记录的增删改查

### 🏥 健康随访

- **健康随访记录列表**：猫咪昵称、随访日期、体重、精神状态等预览
- **单条详情**：完整展示记录全部字段，支持编辑和删除
- **基础 CRUD**：健康随访记录的增删改查

## API 概览

### 流浪猫目击标注 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/cat-sightings` | 目击标注列表（按发现时间倒序） |
| GET | `/api/cat-sightings/:id` | 单条目击标注详情 |
| POST | `/api/cat-sightings` | 新建目击标注 |
| PUT | `/api/cat-sightings/:id` | 更新目击标注 |
| DELETE | `/api/cat-sightings/:id` | 删除目击标注 |

### 投喂记录 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/feeding` | 投喂记录列表（按日期倒序） |
| GET | `/api/feeding/:id` | 单条投喂记录详情 |
| POST | `/api/feeding` | 新建投喂记录 |
| PUT | `/api/feeding/:id` | 更新投喂记录 |
| DELETE | `/api/feeding/:id` | 删除投喂记录 |

### 健康随访记录 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health-followup` | 健康随访记录列表 |
| GET | `/api/health-followup/:id` | 单条健康随访记录详情 |
| POST | `/api/health-followup` | 新建健康随访记录 |
| PUT | `/api/health-followup/:id` | 更新健康随访记录 |
| DELETE | `/api/health-followup/:id` | 删除健康随访记录 |

## 数据字段

### 流浪猫目击标注

| 字段 | 说明 | 必填 |
|------|------|------|
| cat_nickname | 猫咪昵称 | 是 |
| latitude | 纬度（数字） | 是 |
| longitude | 经度（数字） | 是 |
| sighting_time | 发现时间（YYYY-MM-DD HH:mm:ss） | 是 |
| location_description | 地点描述 | 是 |

### 投喂记录

| 字段 | 说明 | 必填 |
|------|------|------|
| feeding_date | 投喂日期（YYYY-MM-DD） | 是 |
| location | 投喂地点 | 是 |
| cat_food_type | 猫粮种类 | 是 |
| quantity | 投喂量 | 是 |
| remark | 备注 | 否 |

### 健康随访记录

| 字段 | 说明 | 必填 |
|------|------|------|
| cat_nickname | 猫咪昵称 | 是 |
| followup_date | 随访日期 | 是 |
| weight | 体重（kg） | 是 |
| mental_status | 精神状态 | 是 |
| went_doctor | 是否就医（0/1） | 是 |
| remark | 备注 | 否 |

## 目录结构

```
├── backend/          # Express API + SQLite
│   ├── data/         # feeding.db（运行时自动生成）
│   └── src/
│       ├── routes/
│       │   ├── catSighting.js    # 目击标注路由
│       │   ├── feeding.js        # 投喂记录路由
│       │   └── healthFollowup.js # 健康随访路由
│       ├── db.js       # 数据库初始化与表结构
│       ├── seed.js     # 示例数据播种
│       └── index.js    # 应用入口
├── frontend/         # React 前端
│   └── src/
│       ├── components/
│       │   └── AppLayout.tsx
│       ├── pages/
│       │   ├── CatSightingListPage.tsx    # 目击地图列表页
│       │   ├── CatSightingDetailPage.tsx  # 目击地图详情页
│       │   ├── FeedingListPage.tsx
│       │   ├── FeedingDetailPage.tsx
│       │   ├── HealthFollowupListPage.tsx
│       │   └── HealthFollowupDetailPage.tsx
│       ├── App.tsx     # 路由配置
│       ├── api.ts      # API 请求封装
│       ├── store.ts    # zustand 状态管理
│       ├── types.ts    # 类型定义
│       └── main.tsx
└── README.md
```
