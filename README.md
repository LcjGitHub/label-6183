# 城市野猫观察日志

记录城市里流浪猫的日常观察：猫咪档案 + 观察 Timeline。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React + Mantine + zustand + axios（端口 **5101**） |
| 后端 | Express + SQLite（`backend/data/cats.db`，端口 **5000**，使用 Node 内置 `node:sqlite`） |

## 快速启动

### 1. 后端（一条命令）

```bash
cd backend && npm install && npm start
```

服务地址：`http://localhost:5000`

首次启动会自动创建数据库并写入 seed 数据（3 只猫，各 3 条观察日志）。

开发时可用热重载：

```bash
cd backend && npm run dev
```

### 2. 前端

另开一个终端：

```bash
cd frontend && npm install && npm run dev
```

浏览器访问：`http://localhost:5101`

## 功能（MVP）

- **猫咪档案列表**：昵称、毛色、地点、性格
- **单猫详情**：档案信息 + 观察日志 Timeline（日期、内容）
- **基础 CRUD**：猫咪与观察日志的增删改查

## API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/cats` | 猫咪列表 |
| GET | `/api/cats/:id` | 猫咪详情（含日志） |
| POST | `/api/cats` | 新建猫咪 |
| PUT | `/api/cats/:id` | 更新猫咪 |
| DELETE | `/api/cats/:id` | 删除猫咪 |
| POST | `/api/logs/cat/:catId` | 新增观察日志 |
| PUT | `/api/logs/:id` | 更新日志 |
| DELETE | `/api/logs/:id` | 删除日志 |

## 目录结构

```
├── backend/          # Express API + SQLite
│   ├── data/         # cats.db（运行时生成）
│   └── src/
├── frontend/         # React 前端
│   └── src/
└── README.md
```
