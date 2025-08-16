# 📅 我的每日计划系统

一个基于 GitHub Pages 的个人每日计划管理系统，提供 HTML 和 Markdown 两种版本，帮助您规划每天的任务和追踪长期目标。

## 🎯 两种版本选择

### 📱 HTML 版本 (index.html)
- 交互式网页界面，适合在线查看和操作
- 实时任务状态保存和统计
- 美观的可视化界面

### 📝 Markdown 版本 (index-md.html + daily-plans/)
- 基于 Markdown 文件的计划管理
- 支持版本控制和离线编辑
- 更适合程序员和喜欢纯文本的用户

## ✨ 功能特性

### HTML 版本特性
- 📊 **每周计划视图** - 清晰展示一周七天的计划安排
- 🎯 **长期目标追踪** - 设定和监控长期目标的完成进度
- 📝 **计划模板** - 提供多种预设模板，快速创建计划
- ✅ **任务管理** - 支持任务完成状态的记录和统计
- 💾 **本地存储** - 自动保存任务状态，刷新页面不丢失
- 📱 **响应式设计** - 完美适配手机、平板和桌面设备
- 🌈 **美观界面** - 现代化的渐变设计和流畅的交互效果

### Markdown 版本特性
- 📁 **文件夹组织** - 按年月自动组织计划文件
- 📝 **Markdown 格式** - 支持任何 Markdown 编辑器
- 🤖 **自动生成** - Python 脚本自动创建计划文件
- 🏷️ **标签系统** - 使用标签分类和管理任务
- 📊 **进度追踪** - 内置任务完成状态统计
- 🔄 **版本控制** - 完美支持 Git 版本控制
- 🎯 **模板系统** - 每日、每周、每月模板

## 🚀 快速开始

### 部署到 GitHub Pages

1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 上创建一个新的公开仓库，例如 "daily-plan"
   ```

2. **上传项目文件**
   ```bash
   # 克隆您的仓库
   git clone https://github.com/您的用户名/daily-plan.git
   cd daily-plan
   
   # 将项目文件复制到仓库目录
   # 包括: index.html, goals.html, templates.html, styles.css, script.js, README.md
   
   # 提交并推送
   git add .
   git commit -m "初始化每日计划系统"
   git push origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库的 Settings 页面
   - 滚动到 "Pages" 部分
   - 在 "Source" 下选择 "Deploy from a branch"
   - 选择 "main" 分支和 "/ (root)" 文件夹
   - 点击 "Save"

4. **访问您的网站**
   - GitHub 会提供一个网址，通常是：`https://您的用户名.github.io/仓库名`
   - 几分钟后就可以访问您的每日计划系统了！

## 📖 使用指南

### HTML 版本使用

#### 主页面 (index.html)
- 显示当前周的计划安排
- 支持任务的勾选和完成状态记录
- 提供快速操作按钮（清空任务、导出计划、查看统计）

#### 长期目标页面 (goals.html)
- 按分类管理长期目标（职业发展、健康生活、个人成长、财务规划）
- 可视化进度条显示目标完成情况
- 详细的行动计划和里程碑追踪

#### 模板页面 (templates.html)
- 提供多种预设模板（工作日、周末、学习、健康等）
- 支持创建和保存自定义模板
- 一键应用模板到您的计划中

### Markdown 版本使用

#### 1. 自动生成计划文件
```bash
# 交互式生成
python generate-daily-plan.py

# 快速生成今日计划
python generate-daily-plan.py today

# 生成指定日期计划
python generate-daily-plan.py date 2024-01-20

# 生成本周计划
python generate-daily-plan.py week
```

#### 2. 文件结构
```
daily-plans/
├── README.md                 # 说明文件
├── goals.md                  # 长期目标
├── templates/               # 模板文件夹
│   ├── daily-template.md    # 每日模板
│   ├── weekly-template.md   # 每周模板
│   └── monthly-template.md  # 每月模板
└── 2024/                   # 按年份组织
    ├── 01-January/         # 按月份组织
    │   ├── 2024-01-15.md   # 每日计划文件
    │   └── 2024-03-week-summary.md  # 周总结
    └── 02-February/
```

#### 3. Markdown 任务语法
- `- [ ]` 未完成任务
- `- [x]` 已完成任务  
- `- [~]` 部分完成任务
- `- [-]` 取消的任务

#### 4. 标签系统
使用标签来分类任务：
- `#工作` - 工作相关任务
- `#学习` - 学习相关任务
- `#健康` - 健康相关任务
- `#家庭` - 家庭相关任务
- `#个人` - 个人发展任务

#### 5. 编辑建议
- 使用任何支持 Markdown 的编辑器（VS Code、Typora、Obsidian 等）
- 可以配合 Git 进行版本控制
- 支持跨平台同步和编辑

### 功能说明

#### 任务管理
- ✅ 点击复选框标记任务完成
- 💾 任务状态自动保存到浏览器本地存储
- 📊 实时统计完成进度

#### 快捷键
- `Ctrl + S` - 手动保存任务状态
- `Ctrl + E` - 导出当前周计划

#### 数据导出
- 支持将计划导出为 JSON 格式
- 包含任务内容和完成状态
- 便于备份和数据迁移

## 🛠️ 自定义配置

### 修改计划内容
编辑 `index.html` 文件中的任务列表：
```html
<li class="task-item">
    <input type="checkbox" id="mon-1">
    <label for="mon-1">您的任务内容</label>
</li>
```

### 添加新的目标类别
在 `goals.html` 中添加新的目标分类：
```html
<div class="goal-category">
    <h3>🎨 新分类名称</h3>
    <!-- 目标内容 -->
</div>
```

### 创建新模板
在 `templates.html` 中添加新的模板：
```html
<div class="template-item">
    <h4>模板名称</h4>
    <div class="template-content">
        <!-- 模板内容 -->
    </div>
    <button class="apply-template" onclick="applyTemplate('template-id')">应用此模板</button>
</div>
```

## 🎨 样式自定义

### 修改主题颜色
在 `styles.css` 中修改 CSS 变量：
```css
:root {
    --primary-color: #667eea;  /* 主色调 */
    --secondary-color: #764ba2; /* 辅助色 */
    --accent-color: #ff6b6b;   /* 强调色 */
}
```

### 响应式断点
- 桌面端：> 768px
- 平板端：481px - 768px  
- 手机端：< 480px

## 📱 移动端优化

- 触摸友好的界面设计
- 自适应布局，完美适配各种屏幕尺寸
- 优化的字体大小和间距
- 手势操作支持

## 🔧 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画（Flexbox、Grid、渐变、动画）
- **Vanilla JavaScript** - 交互功能
- **LocalStorage** - 本地数据存储
- **GitHub Pages** - 静态网站托管

## 📝 更新日志

### v1.0.0 (2024-12-19)
- ✨ 初始版本发布
- 📅 基础的每周计划功能
- 🎯 长期目标管理
- 📝 计划模板系统
- 💾 本地存储支持
- 📱 响应式设计

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

## 📞 联系方式

如果您有任何问题或建议，请通过以下方式联系：

- 📧 邮箱：[您的邮箱]
- 🐙 GitHub Issues：[项目地址/issues]

---

⭐ 如果这个项目对您有帮助，请给它一个 Star！
