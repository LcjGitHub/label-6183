# 社区流浪猫投喂登记

记录社区流浪猫的每一次爱心投喂：投喂日期、地点、猫粮种类、投喂量、备注。

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

首次启动会自动创建数据库并写入 4 条示例投喂记录。

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

## 功能

- **投喂记录列表**：日期、地点、猫粮种类、投喂量、备注预览
- **单条详情**：完整展示记录全部字段，支持编辑和删除
- **基础 CRUD**：投喂记录的增删改查

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/feeding` | 投喂记录列表（按日期倒序） |
| GET | `/api/feeding/:id` | 单条投喂记录详情 |
| POST | `/api/feeding` | 新建投喂记录 |
| PUT | `/api/feeding/:id` | 更新投喂记录 |
| DELETE | `/api/feeding/:id` | 删除投喂记录 |

## 数据字段

每条投喂记录包含：

| 字段 | 说明 | 必填 |
|------|------|------|
| feeding_date | 投喂日期（YYYY-MM-DD） | 是 |
| location | 投喂地点 | 是 |
| cat_food_type | 猫粮种类 | 是 |
| quantity | 投喂量 | 是 |
| remark | 备注 | 否 |

## 目录结构

```
├── backend/          # Express API + SQLite
│   ├── data/         # feeding.db（运行时生成）
│   └── src/
├── frontend/         # React 前端
│   └── src/
└── README.md
```
