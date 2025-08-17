# 🚀 本地预览启动指南

## 📱 快速启动本地预览

### Linux/macOS 用户

```bash
# 方法1：使用启动脚本（推荐）
./start.sh

# 方法2：直接使用Python命令
python3 -m http.server 8000
```

### Windows 用户

```cmd
# 方法1：使用批处理文件（推荐）
start.bat

# 方法2：直接使用Python命令
python -m http.server 8000
```

## 🌐 访问地址

启动成功后，在浏览器中访问：
- **本地访问**: http://localhost:8000
- **局域网访问**: http://你的IP地址:8000

## 🛑 停止预览

在终端中按 `Ctrl + C` 即可停止服务器

## ✨ 功能特性

- 📅 完整的每日计划系统
- 🗂️ 层级导航（年份/月份/日期）
- 🔍 搜索功能
- 📊 统计信息
- 🔗 自动渲染Markdown链接
- 📱 响应式设计

## 🔧 故障排除

### 端口被占用
如果看到"端口8000已被占用"的错误：
- 启动脚本会自动处理
- 或者手动运行：`pkill -f "python3 -m http.server"`

### 链接不显示
- 确保已刷新浏览器页面
- 检查控制台是否有错误信息

## 📝 更新计划

修改计划内容后：
```bash
# 重新生成所有计划
python3 generate-daily-plans.py

# 或者更新导航数据
python3 generate-nav.py
```

---

🎯 **现在您可以通过运行启动脚本来快速预览每日计划系统了！**
