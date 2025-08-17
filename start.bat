@echo off
chcp 65001 >nul
echo 🚀 启动每日计划系统本地预览...
echo.

REM 检查端口是否被占用并停止
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    echo ⚠️  端口 8000 已被占用，正在停止...
    taskkill /f /pid %%a >nul 2>&1
    timeout /t 2 >nul
)

echo 🌐 启动HTTP服务器在端口 8000...
echo 📱 请在浏览器中访问: http://localhost:8000
echo 🛑 按 Ctrl+C 停止服务器
echo.

REM 启动服务器
python -m http.server 8000
