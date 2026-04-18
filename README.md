# 健身为王 - Fitness Astro

个人健身追踪网站，前端基于 Astro + TailwindCSS，后端基于 Node.js + Express + SQLite。

## 功能特性

- 💪 **每日训练** - 随机生成每日训练，坚持打卡
- 📚 **训练库** - 预置多种分类训练（初学者、力量、核心、有氧、拉伸）
- 🎯 **月度挑战** - 参与健身挑战，培养锻炼习惯
- 📅 **健身计划** - 创建并管理个性化健身计划
- 🔐 **用户系统** - JWT 认证，数据云端存储
- 🌓 **深色模式** - 支持浅色/深色主题切换
- 📱 **响应式** - 完美适配手机和桌面

## 技术架构

- **前端**: Astro 5.x + TailwindCSS v4 + TypeScript
- **后端**: Node.js + Express + SQLite + Sequelize + JWT
- **部署**: 前端 GitHub Pages 托管，后端部署到自己服务器

## 项目结构

```
fitness-astro/             <- 这个仓库 (前端)
├── src/
│   ├── pages/             页面 (首页、每日训练、训练库等)
│   ├── components/        公用组件 (Header、Footer)
│   ├── layouts/           页面布局
│   ├── data/fitness/      预置训练数据
│   ├── scripts/           客户端 JavaScript (API 客户端)
│   └── styles/            全局样式
├── public/                静态资源
└── astro.config.ts        Astro 配置

fitness-backend/           <- 后端 API 仓库 (单独部署)
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
├── app.js
└── server.js
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器 (http://localhost:3000)
npm run dev

# 构建生产版本
npm run build
```

## 环境变量

创建 `.env` 文件：

```env
# API 后端地址 (你的后端服务器地址)
PUBLIC_API_BASE_URL=http://your-server.com/api
# GitHub Pages 站点 URL
PUBLIC_SITE_URL=https://your-username.github.io/fitness
# base 路径 (如果部署到子路径，比如 /fitness)
PUBLIC_BASE_PATH=/fitness
```

## GitHub Pages 部署

1. 将代码推送到你的 GitHub 仓库
2. 在仓库设置 → Pages → 部署源选择 "GitHub Actions"
3. 在仓库设置 → Secrets and variables → Actions 添加：
   - `PUBLIC_API_BASE_URL`: 你的后端 API 地址
   - `PUBLIC_BASE_PATH`: 你的 base 路径（比如 `/fitness` 如果仓库名是 fitness）
4. 推送到 main 分支，GitHub Actions 会自动构建部署

## 许可证

MIT
