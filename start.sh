#!/bin/bash

# 每日计划系统 - 本地预览启动脚本
# 使用方法: ./start-preview.sh

echo "🚀 启动每日计划系统本地预览..."
echo ""

# 检查端口是否被占用
PORT=8000
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 $PORT 已被占用，正在停止..."
    pkill -f "python3 -m http.server $PORT"
    sleep 2
fi

# 启动HTTP服务器
echo "🌐 启动HTTP服务器在端口 $PORT..."
echo "📱 请在浏览器中访问: http://localhost:$PORT"
echo "🛑 按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
python3 -m http.server $PORT
