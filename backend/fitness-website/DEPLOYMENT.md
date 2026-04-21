# 健身为王 - 部署说明文档

## 项目概述

**健身为王** 是一个全栈健身管理系统，设计风格参考 [darebee.com](https://darebee.com)，特点是极简实用、免费无广告。

- **前端**：静态HTML + Tailwind CSS (CDN) + 原生JavaScript
- **后端**：Node.js + Express + SQLite + Sequelize ORM + JWT认证
- **部署目标**：`sbnone.dpdns.org`

## 项目文件结构

```
/root/hermes-agent/
├── fitness-website/          # 前端静态文件 (本目录)
└── fitness-backend/          # 后端API服务
```

## 部署步骤 (到 sbnone.dpdns.org 服务器)

### 1. 上传文件到服务器

假设你已经通过SSH登录到 `sbnone.dpdns.org` 服务器：

```bash
# 在本地机器上执行
scp -r /root/hermes-agent/fitness-website root@sbnone.dpdns.org:/var/www/fitness-website
scp -r /root/hermes-agent/fitness-backend root@sbnone.dpdns.org:/var/www/fitness-backend
```

### 2. 安装后端依赖

```bash
# 登录到服务器后
cd /var/www/fitness-backend
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env
nano .env
```

修改 `JWT_SECRET` 为一个随机安全字符串：

```
PORT=3000
DB_PATH=./fitness.db
JWT_SECRET=your_very_long_random_secret_key_here
```

### 4. 配置 Nginx 反向代理

编辑 Nginx 配置文件 `/etc/nginx/sites-available/sbnone.dpdns.org`：

```nginx
server {
    listen 80;
    server_name sbnone.dpdns.org;

    # 前端静态文件
    location / {
        root /var/www/fitness-website;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # 后端API反向代理
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

启用配置：

```bash
ln -sf /etc/nginx/sites-available/sbnone.dpdns.org /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 5. 使用 systemd 管理后端服务

创建 `/etc/systemd/system/fitness-backend.service`：

```ini
[Unit]
Description=Fitness Backend API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/fitness-backend
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

启用并启动服务：

```bash
systemctl daemon-reload
systemctl enable fitness-backend
systemctl start fitness-backend
systemctl status fitness-backend
```

### 6. 验证部署

- 访问网站：http://sbnone.dpdns.org
- 检查API健康：http://sbnone.dpdns.org/api/health-check

预期返回：
```json
{
  "status": "ok",
  "message": "Server is running",
  "database": "connected"
}
```

## API 端点说明

### 认证 `POST /api/auth`
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/me` - 获取当前用户信息
- `POST /api/auth/logout` - 用户退出

### 训练记录 `POST /api/workouts`
- `GET /api/workouts` - 获取用户训练列表 (支持分页和过滤)
- `GET /api/workouts/:id` - 获取单个训练
- `POST /api/workouts` - 创建训练记录
- `PUT /api/workouts/:id` - 更新训练记录
- `DELETE /api/workouts/:id` - 删除训练记录

### 健康记录 `POST /api/health`
- `GET /api/health` - 获取健康记录列表
- `GET /api/health/latest` - 获取最新健康记录
- `GET /api/health/:id` - 获取单个健康记录
- `POST /api/health` - 创建健康记录
- `PUT /api/health/:id` - 更新健康记录
- `DELETE /api/health/:id` - 删除健康记录

## 功能说明

### 已实现功能 (第一阶段)
1. ✅ 用户注册/登录系统 (JWT认证)
2. ✅ 训练记录保存与管理
3. ✅ 健康数据追踪 (体重、体脂、围度等)
4. ✅ 每日训练 (根据日期自动选择预置训练)
5. ✅ 训练库浏览 (按难度和肌肉组过滤)
6. ✅ 月度挑战 (本地追踪完成情况)
7. ✅ 健身计划浏览
8. ✅ 响应式设计，支持移动端

### 预置训练内容
- 全身入门训练 × 2
- 有氧训练 × 2
- 核心训练 × 2
- 柔韧性训练 × 1

## 本地开发测试

```bash
# 启动后端开发服务器
cd /root/hermes-agent/fitness-backend
npm install
npm test        # 运行所有测试 (64/64 应该全部通过)
npm start       # 启动开发服务器

# 前端可以直接用浏览器打开，或使用静态文件服务器
cd /root/hermes-agent/fitness-website
python3 -m http.server 8000
# 然后访问 http://localhost:8000
```

## 技术要点

- 所有用户数据隔离，用户只能访问自己的数据
- JWT token 存储在 localStorage
- 密码使用 bcrypt 哈希存储，不会明文保存
- SQLite 数据库，无需额外数据库服务，部署简单
- 前端不依赖框架，使用原生JavaScript，加载速度快
- Tailwind CSS via CDN，无需本地编译

## 故障排查

### 问题：后端服务无法启动
- 检查 `JWT_SECRET` 是否在 `.env` 中设置
- 检查端口 3000 是否被占用
- 查看日志：`journalctl -u fitness-backend -f`

### 问题：API 返回 404
- 检查 Nginx 反向代理配置是否正确
- 确认 `location /api/` 配置正确，末尾有斜杠

### 问题：数据库权限错误
- 确保 `fitness-backend/` 目录对 Node.js 进程可写
- `chown -R www-data:www-data /var/www/fitness-backend`

## 后续开发计划 (第二阶段)

1. AI 智能训练计划生成
2. 训练数据可视化分析
3. 社交分享功能
4. PWA 支持，可安装到手机
