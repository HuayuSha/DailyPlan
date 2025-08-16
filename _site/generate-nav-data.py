#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成导航数据的脚本
扫描daily-plans目录，生成年份-月份-日期的层级结构
"""

import os
import json
import re
from datetime import datetime
from pathlib import Path

def extract_date_from_filename(filename):
    """从文件名中提取日期"""
    # 匹配 YYYY-MM-DD 格式
    date_pattern = r'(\d{4})-(\d{2})-(\d{2})'
    match = re.search(date_pattern, filename)
    if match:
        return match.groups()
    return None

def scan_plans_directory():
    """扫描plans目录，构建层级结构"""
    plans_data = {}
    daily_plans_dir = Path("daily-plans")
    
    if not daily_plans_dir.exists():
        print("daily-plans目录不存在")
        return plans_data
    
    # 遍历所有markdown文件
    for md_file in daily_plans_dir.rglob("*.md"):
        if md_file.name.startswith("."):  # 跳过隐藏文件
            continue
            
        # 提取日期
        date_parts = extract_date_from_filename(md_file.name)
        if not date_parts:
            continue
            
        year, month, date = date_parts
        
        # 读取文件内容
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 提取标题
            title_match = re.search(r'title:\s*["\']([^"\']+)["\']', content)
            title = title_match.group(1) if title_match else f"{year}年{month}月{date}日 - 每日计划"
            
            # 提取前200个字符作为预览
            preview = re.sub(r'^---.*?---', '', content, flags=re.DOTALL).strip()
            preview = re.sub(r'[#*`\-\[\]]', '', preview)  # 移除markdown标记
            preview = preview[:200] + "..." if len(preview) > 200 else preview
            
        except Exception as e:
            print(f"读取文件 {md_file} 时出错: {e}")
            title = f"{year}年{month}月{date}日 - 每日计划"
            preview = "无法读取内容"
        
        # 构建数据结构
        if year not in plans_data:
            plans_data[year] = {}
        if month not in plans_data[year]:
            plans_data[year][month] = {}
            
        plans_data[year][month][date] = {
            "title": title,
            "content": preview,
            "file_path": str(md_file.relative_to(daily_plans_dir)),
            "full_path": str(md_file)
        }
    
    return plans_data

def generate_nav_data():
    """生成导航数据"""
    plans_data = scan_plans_directory()
    
    # 生成JavaScript数据
    js_data = "const plansData = " + json.dumps(plans_data, ensure_ascii=False, indent=2) + ";"
    
    # 保存到文件
    with open("nav-data.js", "w", encoding="utf-8") as f:
        f.write(js_data)
    
    print(f"导航数据已生成到 nav-data.js")
    print(f"共找到 {sum(len(months) for months in plans_data.values())} 个月份的计划")
    
    # 打印统计信息
    for year in sorted(plans_data.keys()):
        print(f"\n{year}年:")
        for month in sorted(plans_data[year].keys()):
            month_names = ['一月', '二月', '三月', '四月', '五月', '六月', 
                          '七月', '八月', '九月', '十月', '十一月', '十二月']
            month_name = month_names[int(month) - 1]
            count = len(plans_data[year][month])
            print(f"  {month_name}: {count} 个计划")
    
    return plans_data

def update_html_with_real_data():
    """更新HTML文件，使用真实的导航数据"""
    plans_data = scan_plans_directory()
    
    # 读取HTML文件
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()
    
    # 替换JavaScript数据部分
    js_data = "const plansData = " + json.dumps(plans_data, ensure_ascii=False, indent=2) + ";"
    
    # 使用正则表达式替换
    pattern = r'const plansData = \{.*?\};'
    replacement = js_data
    
    updated_html = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    
    # 保存更新后的HTML
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(updated_html)
    
    print("HTML文件已更新，包含真实的导航数据")

if __name__ == "__main__":
    print("正在扫描daily-plans目录...")
    plans_data = generate_nav_data()
    
    print("\n正在更新HTML文件...")
    update_html_with_real_data()
    
    print("\n完成！现在可以打开index.html查看带有真实数据的侧边栏导航了。")
