#!/bin/bash

# 自动更新导航数据脚本
# 在添加新计划后运行此脚本

echo "🔄 开始更新导航数据..."

# 运行Python脚本生成新的导航数据
python3 generate-nav.py

# 检查是否成功生成
if [ -f "nav-data.json" ]; then
    echo "✅ 导航数据更新成功！"
    echo "📁 文件: nav-data.json"
    
    # 显示文件大小
    file_size=$(du -h nav-data.json | cut -f1)
    echo "📊 文件大小: $file_size"
    
    # 显示找到的计划数量
    plan_count=$(python3 -c "
import json
with open('nav-data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    count = sum(len(days) for months in data.values() for days in months.values())
    print(count)
")
    echo "📅 计划总数: $plan_count"
    
else
    echo "❌ 导航数据生成失败！"
    exit 1
fi

echo "🎉 更新完成！现在可以提交到GitHub了。"
