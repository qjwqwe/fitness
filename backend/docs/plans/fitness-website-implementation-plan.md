# 健身为王 - 健身网站系统实现计划

> 参考 darebee.com 设计风格，创建一个免费无广告的健身资源网站

**Goal:** 创建一个以健身为核心的静态网站系统，借鉴 DAREBEE 的极简实用设计风格，包含每日训练、健身库、挑战计划等核心功能，部署在测试域名 sbnone.dpdns.org。最终方案+代码+说明完整导出到飞书云文档 "健身为王.docx"。

**Architecture:**
- 采用静态 HTML + CSS + JavaScript 架构，无需数据库，纯前端实现，部署简单
- 使用 Tailwind CSS v3 实现响应式布局，保持极简设计风格
- 模块化结构：首页展示每日更新，分类页面展示各类训练，详情页展示具体训练图文
- 颜色方案借鉴 DAREBEE：浅灰背景 + 红色强调色 + 黑色文字，干净清爽无干扰

**Tech Stack:**
- HTML5 + Tailwind CSS v3（CDN引入，无需构建）
- Vanilla JavaScript（交互功能）
- 静态网站，可直接部署在任何HTTP服务器
- 输出为完整可运行文件包

---

## 任务清单（按顺序）

### Task 1: 创建项目目录结构
**Objective:** 创建完整的网站目录结构，准备基础文件骨架

**Files:**
- Create: `fitness-website/index.html` (首页)
- Create: `fitness-website/css/custom.css` (自定义样式)
- Create: `fitness-website/js/main.js` (JavaScript交互)
- Create: `fitness-website/daily.html` (每日训练)
- Create: `fitness-website/workouts.html` (训练库)
- Create: `fitness-website/challenges.html` (月度挑战)
- Create: `fitness-website/programs.html` (健身计划)
- Create: `fitness-website/about.html` (关于我们)
- Create: `fitness-website/images/` (图片目录，使用占位SVG)
- Create: `fitness-website/data/workouts.js` (训练数据)

**Step 1: Create directories**
```bash
mkdir -p fitness-website/{css,js,images,data,pages}
```

**Step 2: Create base HTML template with Tailwind CSS CDN**
每个HTML文件头部引入Tailwind CSS，保持统一风格。

**Step 3: Verify structure created**
```bash
ls -la fitness-website/
```

**Step 4: Commit**
```bash
git add docs/plans/fitness-website-implementation-plan.md fitness-website/
git commit -m "chore: init project structure for fitness website"
```

---

### Task 2: 实现首页(index.html) - 仿DAREBEE布局
**Objective:** 创建首页，模仿DAREBEE的栅格卡片布局，展示每日更新内容

**Files:**
- Modify: `fitness-website/index.html`
- Modify: `fitness-website/css/custom.css`

**Requirements:**
- 顶部导航栏：汉堡菜单 + 网站logo "健身为王" (红色背景白色文字)
- 首屏四个卡片区块：
  1. 左上：今日动作 (Exercise of the Day)
  2. 右上：今日训练 (Workout of the Day)
  3. 左下：本月挑战 (This Month's Challenge)
  4. 右下：更新公告 (Updates)
- 中部四个功能区卡片：
  1. 站点理念：免费、无广告、社区支持
  2. 项目介绍：关于我们导航链接
  3. 新手上路：入门指引链接
  4. 资源中心：电子书下载
- 页脚：导航链接、站点说明、社交媒体
- 使用 Tailwind CSS 响应式布局，移动端自动堆叠

**Step 1: Write HTML structure**
使用Tailwind网格布局 `grid grid-cols-1 md:grid-cols-2 gap-4` 实现响应式。

**Step 2: Add custom styles for DAREBEE-like look**
- 红色强调色：`#ff3b30`
- 背景色：浅灰色 `#f5f5f0`
- 卡片白色背景，圆角阴影

**Step 3: Verify in browser (navigation links work)**

**Step 4: Commit**
```bash
git add fitness-website/index.html fitness-website/css/custom.css
git commit -m "feat: implement homepage with darebee-style layout"
```

---

### Task 3: 实现基础CSS样式和配色方案
**Objective:** 统一全站样式，保持DAREBEE极简实用风格

**Files:**
- Modify: `fitness-website/css/custom.css`

**Requirements:**
- 全局字体：无衬线 `system-ui, -apple-system, sans-serif`
- 配色方案定义：
  --primary-red: #ff3b30;
  --bg-gray: #f5f5f0;
  --card-white: #ffffff;
  --text-black: #1a1a1a;
  --text-gray: #666666;
- 卡片样式：白色背景，轻微阴影，圆角
- 按钮样式：红色背景，白色文字，悬停效果
- 响应式断点：移动端 (<768px) 单列，平板以上双列

**Step 1: Define CSS variables**
**Step 2: Global reset and base styles**
**Step 3: Component classes for cards, buttons, navigation**
**Step 4: Commit**
```bash
git add fitness-website/css/custom.css
git commit -m "feat: add custom css with darebee color scheme"
```

---

### Task 4: 创建训练数据结构 (workouts.js)
**Objective:** 定义健身数据结构，存储示例训练数据供页面展示

**Files:**
- Create: `fitness-website/data/workouts.js`

**Requirements:**
- 定义数据结构：
  - Exercise：动作对象 {id, name, description, difficulty, muscleGroup, illustration}
  - Workout：训练对象 {id, name, description, difficulty, duration, exercises, image}
  - Challenge：月度挑战 {id, name, month, description, duration, days}
  - Program：多期计划 {id, name, description, level, weeks}

- 填充示例数据：
  - 10个基础动作（深蹲、俯卧撑、平板支撑等）
  - 5个完整训练（上肢、下肢、核心、全身、有氧）
  - 1个示例月度挑战

**Step 1: Define JavaScript data structures**
**Step 2: Add sample workout data**
**Step 3: Export data for use by pages**
**Step 4: Commit**
```bash
git add fitness-website/data/workouts.js
git commit -m "feat: add workout data structure with sample data"
```

---

### Task 5: 实现每日训练页面 (daily.html)
**Objective:** 创建每日训练页面，展示今日动作和今日训练

**Files:**
- Create: `fitness-website/daily.html`
- Modify: `fitness-website/js/main.js`

**Requirements:**
- 页面顶部显示日期
- 今日动作卡片：展示单个动作，含说明、难度、肌肉群
- 今日完整训练卡片：展示多个动作组成的训练计划
- 使用JavaScript从数据动态加载内容
- 打印按钮：支持打印训练计划方便离线使用

**Step 1: HTML structure with two main cards**
**Step 2: JavaScript to load daily workout from data**
**Step 3: Add print functionality**
**Step 4: Test that content loads correctly**
**Step 5: Commit**
```bash
git add fitness-website/daily.html fitness-website/js/main.js
git commit -m "feat: implement daily workout page"
```

---

### Task 6: 实现训练库页面 (workouts.html)
**Objective:** 创建训练库页面，卡片网格展示所有可用训练，支持筛选

**Files:**
- Create: `fitness-website/workouts.html`
- Modify: `fitness-website/js/main.js`

**Requirements:**
- 顶部筛选栏：按难度（初级/中级/高级）、按部位（全身/上肢/下肢/核心/有氧）筛选
- 网格展示训练卡片：每个卡片显示训练名称、难度、时长、缩略图
- 点击卡片跳转到训练详情
- 响应式网格：移动端2列，桌面端3-4列

**Step 1: HTML structure with filter bar and workout grid**
**Step 2: JavaScript to render workout cards from data**
**Step 3: Add filter interactivity**
**Step 4: Test filtering works correctly**
**Step 5: Commit**
```bash
git add fitness-website/workouts.html fitness-website/js/main.js
git commit -m "feat: implement workout library page with filtering"
```

---

### Task 7: 实现月度挑战页面 (challenges.html)
**Objective:** 创建月度挑战页面，展示当前和历史挑战

**Files:**
- Create: `fitness-website/challenges.html`

**Requirements:**
- 突出展示当前月度挑战
- 卡片展示挑战信息：名称、时长、难度、描述
- 日历视图展示每日任务安排
- 支持保存进度（localStorage）

**Step 1: HTML structure for current challenge**
**Step 2: Add challenge description and calendar grid**
**Step 3: JavaScript for progress tracking**
**Step 4: Commit**
```bash
git add fitness-website/challenges.html fitness-website/js/main.js
git commit -m "feat: implement challenges page with progress tracking"
```

---

### Task 8: 实现健身计划页面 (programs.html)
**Objective:** 创建多周健身计划页面

**Files:**
- Create: `fitness-website/programs.html`

**Requirements:**
- 展示不同难度的健身计划（新手入门、进阶、减脂、增力）
- 每个计划卡片显示：名称、难度、时长、描述
- 点击进入计划详情，查看每周安排

**Step 1: HTML program grid**
**Step 2: Add sample programs**
**Step 3: Commit**
```bash
git add fitness-website/programs.html
git commit -m "feat: implement programs page"
```

---

### Task 9: 实现关于页面 (about.html)
**Objective:** 创建关于页面，介绍网站理念

**Files:**
- Create: `fitness-website/about.html`

**Requirements:**
- 网站理念：免费、无广告、无付费墙，社区支持
- 新手指引链接：入门、热身拉伸、如何选择计划
- 常见问题FAQ
- 捐赠支持说明

**Step 1: Write content about mission**
**Step 2: Add FAQ section**
**Step 3: Add donation info**
**Step 4: Commit**
```bash
git add fitness-website/about.html
git commit -m "feat: implement about page with mission statement"
```

---

### Task 10: 实现JavaScript交互功能
**Objective:** 添加全站交互：导航菜单、筛选、打印、进度保存

**Files:**
- Modify: `fitness-website/js/main.js`

**Requirements:**
- 移动端汉堡菜单弹出侧边导航
- 训练筛选功能（按难度、部位）
- 打印训练计划功能
- 挑战进度保存到 localStorage
- 每日训练随机推荐功能

**Step 1: Mobile menu toggle**
**Step 2: Workout filtering logic**
**Step 3: Print function**
**Step 4: LocalStorage progress save**
**Step 5: Test all interactions work**
**Step 6: Commit**
```bash
git add fitness-website/js/main.js
git commit -m "feat: implement all javascript interactions"
```

---

### Task 11: 添加SVG占位插画
**Objective:** 创建简洁的SVG动作占位插图，保持手绘风格

**Files:**
- Create: `fitness-website/images/squat.svg`
- Create: `fitness-website/images/pushup.svg`
- Create: `fitness-website/images/plank.svg`
- Create: `fitness-website/images/lunge.svg`

**Requirements:**
- 极简线条风格，类似DAREBEE手绘线稿
- SVG格式，文件小，加载快
- 黑色线条透明背景

**Step 1: Create 4 basic exercise SVGs**
**Step 2: Optimize file sizes**
**Step 3: Commit**
```bash
git add fitness-website/images/
git commit -m "feat: add svg exercise illustrations in darebee style"
```

---

### Task 12: 测试验证所有页面
**Objective:** 验证所有页面能正常打开，链接正确，交互正常

**Files:** All files

**Step 1: Check all HTML files open correctly**
```bash
ls -la fitness-website/*.html
```

**Step 2: Verify all internal links work between pages**
**Step 3: Test JavaScript interactions**
- Mobile menu toggles
- Workout filtering
- Print button
- Progress saving

**Step 4: Check responsive layout by resizing**

**Step 5: Commit any fixes**
```bash
git add fitness-website/
git commit -m "fix: minor fixes after testing"
```

---

### Task 13: 创建部署说明文档
**Objective:** 编写README说明如何部署测试到 sbnone.dpdns.org

**Files:**
- Create: `fitness-website/README.md`

**Content:**
- 项目介绍
- 功能列表
- 本地预览方法
- 部署到服务器步骤
- 技术说明

**Step 1: Write comprehensive README**
**Step 2: Commit**
```bash
git add fitness-website/README.md
git commit -m "docs: add readme with deployment instructions"
```

---

### Task 14: 导出方案+代码+说明到Word文档
**Objective:** 将完整方案、代码、说明导出为Word文档，准备同步到飞书云文档

**Files:**
- Create: `fitness-website-docs/fitness-方案-代码-说明.docx` (使用pandoc转换)

**Step 1: Create markdown document combining plan + code overview**
**Step 2: Convert to docx using pandoc**
**Step 3: Verify document contains all content**
**Step 4: Commit**
```bash
git add fitness-website-docs/
git commit -m "docs: export complete documentation to word"
```

---

## 完成后验收标准

- [x] 所有页面实现完成
- [x] 设计风格接近 DAREBEE（极简、无广告、红色强调色）
- [x] 响应式布局，支持移动端
- [x] 交互功能正常（筛选、打印、进度保存）
- [x] 完整的示例数据
- [x] 代码结构清晰，易于扩展
- [x] Word文档包含完整方案、代码说明、部署指南

**Total tasks: 14 个任务，每个任务 2-5 分钟工作量**
