# 后端部署指南

## 服务器环境要求
- Node.js 18+
- PM2 (进程管理)
- Nginx (反向代理)

## 快速部署

### 1. 克隆项目
```bash
git clone https://github.com/qjwqwe/fitness.git
cd fitness/backend/fitness-backend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件
```

`.env` 配置:
```env
PORT=3000
NODE_ENV=production
JWT_SECRET=你的密钥字符串
CORS_ORIGIN=https://fitness.sbnone.dpdns.org
```

### 4. 使用 PM2 启动
```bash
npm install -g pm2
pm2 start server.js --name fitness-backend
pm2 save
pm2 startup
```

### 5. Nginx 配置
```nginx
server {
    listen 80;
    server_name api-fitness.sbnone.dpdns.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. 配置 SSL (Let's Encrypt)
```bash
certbot --nginx -d api-fitness.sbnone.dpdns.org
```

## 健康检查
部署成功后访问: `https://api-fitness.sbnone.dpdns.org/api/health`

## PM2 常用命令
```bash
pm2 status              # 查看状态
pm2 logs fitness-backend  # 查看日志
pm2 restart fitness-backend  # 重启
pm2 stop fitness-backend  # 停止
```
