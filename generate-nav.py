#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
预生成导航数据脚本
在本地扫描daily-plans目录，生成nav-data.json文件
"""

import os
import json
from datetime import datetime
import glob

def get_weekday(year, month, day):
    """获取星期几"""
    weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    date = datetime(year, int(month), int(day))
    return weekdays[date.weekday()]

def format_date(year, month, day):
    """格式化日期"""
    return f"{year}年{month}月{day}日"

def scan_daily_plans():
    """扫描daily-plans目录"""
    plans_data = {}
    
    # 扫描daily-plans目录
    daily_plans_path = "daily-plans"
    if not os.path.exists(daily_plans_path):
        print(f"目录 {daily_plans_path} 不存在")
        return plans_data
    
    # 扫描年份目录
    for year_dir in sorted(os.listdir(daily_plans_path), reverse=True):
        year_path = os.path.join(daily_plans_path, year_dir)
        if not os.path.isdir(year_path) or not year_dir.isdigit():
            continue
            
        year = year_dir
        plans_data[year] = {}
        
        # 扫描月份目录
        for month_dir in sorted(os.listdir(year_path)):
            month_path = os.path.join(year_path, month_dir)
            if not os.path.isdir(month_path) or not month_dir.isdigit():
                continue
                
            month = month_dir
            plans_data[year][month] = {}
            
            # 扫描日期文件
            for file_name in os.listdir(month_path):
                if file_name.endswith('.md'):
                    day = file_name.replace('.md', '')
                    if day.isdigit():
                        # 生成完整日期信息
                        full_date = datetime(int(year), int(month), int(day))
                        weekday = get_weekday(int(year), int(month), int(day))
                        formatted_date = format_date(year, month, day)
                        
                        plans_data[year][month][day] = {
                            "title": f"每日计划 - {day}日",
                            "content": f"点击查看 {formatted_date} {weekday} 的详细计划内容...",
                            "file_path": f"daily-plans/{year}/{month}/{file_name}",
                            "full_path": f"./daily-plans/{year}/{month}/{file_name}",
                            "filename": file_name,
                            "day": day,
                            "month": month,
                            "year": year,
                            "fullDate": full_date.isoformat(),
                            "weekday": weekday,
                            "formattedDate": formatted_date
                        }
    
    return plans_data

def main():
    """主函数"""
    print("开始扫描daily-plans目录...")
    
    # 扫描目录
    plans_data = scan_daily_plans()
    
    if not plans_data:
        print("没有找到任何计划文件")
        return
    
    # 统计信息
    total_years = len(plans_data)
    total_months = sum(len(months) for months in plans_data.values())
    total_plans = sum(len(days) for months in plans_data.values() for days in months.values())
    
    print(f"扫描完成！")
    print(f"年份数: {total_years}")
    print(f"月份数: {total_months}")
    print(f"计划数: {total_plans}")
    
    # 生成JSON文件
    output_file = "nav-data.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(plans_data, f, ensure_ascii=False, indent=2)
    
    print(f"导航数据已保存到 {output_file}")
    
    # 显示找到的文件
    print("\n找到的计划文件:")
    for year in plans_data:
        for month in plans_data[year]:
            for day in plans_data[year][month]:
                file_info = plans_data[year][month][day]
                print(f"  {file_info['file_path']}")

if __name__ == "__main__":
    main()
