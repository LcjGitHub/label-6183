# 流浪猫目击地图标注

记录社区流浪猫目击信息，在地图上标注发现位置，方便追踪和管理。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + Mantine + zustand + axios（端口 **5101**） |
| 后端 | Express + SQLite（`backend/data/feeding.db`，端口 **5000**，使用 Node 内置 `node:sqlite`） |

## 快速启动

### 1. 启动后端

```bash
cd backend
npm install
npm start
```

服务地址：`http://localhost:5000`

首次启动会自动创建数据库并写入示例数据（投喂记录、健康随访记录、目击标注、领养意向、志愿者排班各若干条）。

开发时可用热重载：

```bash
cd backend && npm run dev
```

### 2. 启动前端

另开一个终端：

```bash
cd frontend
npm install
npm run dev
```

浏览器访问：`http://localhost:5101`，将自动打开「流浪猫目击地图」页面。

## 功能模块

### 🗺️ 流浪猫目击地图

- **标注列表**：卡片展示所有目击标注，卡片左侧显示 80×80 缩略图（无照片时显示 📷 占位图标），右侧展示猫咪昵称、坐标、发现时间、地点描述预览
- **标注详情**：完整展示全部字段，内嵌 OpenStreetMap 地图显示标注点坐标位置；档案卡片下方展示猫咪照片（最大高度 400px，无照片时显示虚线边框占位提示），支持编辑和删除
- **新增 / 编辑弹窗**：表单支持填入照片地址（选填，需传入可访问的图片 URL）
- **基础 CRUD**：标注点的增删改查

### 🍽️ 投喂记录

- **投喂记录列表**：日期、地点、猫粮种类、投喂量、备注预览
- **单条详情**：完整展示记录全部字段，支持编辑和删除
- **基础 CRUD**：投喂记录的增删改查

### 🏥 健康随访

- **健康随访记录列表**：猫咪昵称、随访日期、体重、精神状态等预览
- **单条详情**：完整展示记录全部字段，支持编辑和删除
- **基础 CRUD**：健康随访记录的增删改查

### 🏠 领养意向登记

- **意向列表**：卡片展示所有领养意向，显示申请人姓名、意向猫咪、联系电话、申请日期、补充说明预览；每条卡片内置申请状态下拉选择器，选择后立即保存并更新状态标签
- **新建意向**：弹窗表单录入，字段包含申请人姓名、联系电话、意向猫咪昵称、申请日期、补充说明；申请状态固定为「待审核」
- **意向详情**：完整展示全部字段（补充说明为空时显示「无」），支持编辑所有字段（含申请状态）与删除；编辑与删除按钮顶部留白避免被固定导航栏遮挡
- **基础 CRUD**：领养意向的增删改查（列表页仅保留查看详情入口，删除操作仅限详情页）

### 👥 志愿者排班

- **排班日历**：月历组件展示值班日期，对应日期格子显示当日值班人数，点击日期可筛选当日排班记录
- **排班列表**：按日期分组展示排班记录，显示志愿者姓名、负责区域、联系电话、到岗状态、备注（备注为空时显示「无」）
- **快捷操作**：支持直接勾选「已到岗」状态快速更新，每条记录支持编辑和删除
- **编辑弹窗**：弹窗表单录入/编辑排班信息，字段包含志愿者姓名、值班日期、负责区域、联系电话、是否已到岗、备注
- **日期筛选**：支持通过月历点击或日期选择器按日期筛选排班记录
- **基础 CRUD**：志愿者排班的增删改查

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

### 领养意向登记 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/adoption` | 领养意向列表（按申请日期倒序） |
| GET | `/api/adoption/:id` | 单条领养意向详情 |
| POST | `/api/adoption` | 新建领养意向（默认状态为「待审核」） |
| PUT | `/api/adoption/:id` | 更新领养意向（可单独修改申请状态） |
| DELETE | `/api/adoption/:id` | 删除领养意向 |

### 志愿者排班 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/volunteer-schedule` | 志愿者排班列表（支持 `?date=YYYY-MM-DD` 按日期筛选，按日期升序） |
| GET | `/api/volunteer-schedule/:id` | 单条志愿者排班详情 |
| POST | `/api/volunteer-schedule` | 新建志愿者排班 |
| PUT | `/api/volunteer-schedule/:id` | 更新志愿者排班 |
| DELETE | `/api/volunteer-schedule/:id` | 删除志愿者排班 |

## 数据字段

### 流浪猫目击标注

| 字段 | 说明 | 必填 |
|------|------|------|
| cat_nickname | 猫咪昵称 | 是 |
| latitude | 纬度（数字） | 是 |
| longitude | 经度（数字） | 是 |
| sighting_time | 发现时间（YYYY-MM-DD HH:mm:ss） | 是 |
| location_description | 地点描述 | 是 |
| photo_url | 照片地址（可访问的图片 URL，列表页左侧展示 80×80 缩略图，详情页档案卡片下方展示大图） | 否 |

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

### 领养意向登记

| 字段 | 说明 | 必填 |
|------|------|------|
| applicant_name | 申请人姓名 | 是 |
| phone | 联系电话 | 是 |
| cat_nickname | 意向猫咪昵称 | 是 |
| application_date | 申请日期（YYYY-MM-DD） | 是 |
| application_status | 申请状态（待审核/已通过/已拒绝），新建时默认为「待审核」 | 是 |
| remark | 补充说明 | 否 |

### 志愿者排班

| 字段 | 说明 | 必填 |
|------|------|------|
| volunteer_name | 志愿者姓名 | 是 |
| duty_date | 值班日期（YYYY-MM-DD） | 是 |
| area | 负责区域 | 是 |
| phone | 联系电话 | 是 |
| is_arrived | 是否已到岗（0/1），默认为 0 | 是 |
| remark | 备注 | 否 |

## 目录结构

```
├── backend/          # Express API + SQLite
│   ├── data/         # feeding.db（运行时自动生成）
│   └── src/
│       ├── routes/
│       │   ├── adoption.js           # 领养意向路由
│       │   ├── catSighting.js       # 目击标注路由
│       │   ├── feeding.js           # 投喂记录路由
│       │   ├── healthFollowup.js    # 健康随访路由
│       │   └── volunteerSchedule.js # 志愿者排班路由
│       ├── db.js       # 数据库初始化与表结构
│       ├── seed.js     # 示例数据播种
│       └── index.js    # 应用入口
├── frontend/         # React 前端
│   └── src/
│       ├── components/
│       │   └── AppLayout.tsx
│       ├── pages/
│       │   ├── AdoptionListPage.tsx      # 领养意向列表页
│       │   ├── AdoptionDetailPage.tsx    # 领养意向详情页
│       │   ├── CatSightingListPage.tsx    # 目击地图列表页
│       │   ├── CatSightingDetailPage.tsx  # 目击地图详情页
│       │   ├── FeedingListPage.tsx
│       │   ├── FeedingDetailPage.tsx
│       │   ├── HealthFollowupListPage.tsx
│       │   ├── HealthFollowupDetailPage.tsx
│       │   └── VolunteerScheduleListPage.tsx # 志愿者排班列表页
│       ├── App.tsx     # 路由配置
│       ├── api.ts      # API 请求封装
│       ├── store.ts    # zustand 状态管理
│       ├── types.ts    # 类型定义
│       └── main.tsx
└── README.md
```
