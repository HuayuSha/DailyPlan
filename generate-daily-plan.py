#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
每日计划生成器
自动创建基于模板的每日计划 Markdown 文件
"""

import os
import sys
from datetime import datetime, timedelta
import calendar
import shutil

class DailyPlanGenerator:
    def __init__(self):
        self.base_dir = "daily-plans"
        self.template_dir = os.path.join(self.base_dir, "templates")
        self.daily_template = os.path.join(self.template_dir, "daily-template.md")
        self.weekly_template = os.path.join(self.template_dir, "weekly-template.md")
        
        # 中文星期映射
        self.weekdays_cn = {
            0: "星期一", 1: "星期二", 2: "星期三", 3: "星期四",
            4: "星期五", 5: "星期六", 6: "星期日"
        }
        
        # 中文月份映射
        self.months_cn = {
            1: "01-January", 2: "02-February", 3: "03-March", 4: "04-April",
            5: "05-May", 6: "06-June", 7: "07-July", 8: "08-August",
            9: "09-September", 10: "10-October", 11: "11-November", 12: "12-December"
        }

    def ensure_directories(self, date):
        """确保目标目录存在"""
        year = date.strftime("%Y")
        month_dir = self.months_cn[date.month]
        
        target_dir = os.path.join(self.base_dir, year, month_dir)
        os.makedirs(target_dir, exist_ok=True)
        
        return target_dir

    def generate_daily_plan(self, date=None):
        """生成每日计划文件"""
        if date is None:
            date = datetime.now()
        
        # 确保目录存在
        target_dir = self.ensure_directories(date)
        
        # 生成文件名
        filename = f"{date.strftime('%Y-%m-%d')}.md"
        filepath = os.path.join(target_dir, filename)
        
        # 检查文件是否已存在
        if os.path.exists(filepath):
            response = input(f"文件 {filename} 已存在，是否覆盖？(y/N): ")
            if response.lower() != 'y':
                print("操作已取消")
                return False
        
        # 读取模板
        if not os.path.exists(self.daily_template):
            print(f"错误：模板文件不存在 {self.daily_template}")
            return False
        
        with open(self.daily_template, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        # 替换模板中的占位符
        content = self.replace_placeholders(template_content, date)
        
        # 写入文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 成功生成每日计划：{filepath}")
        return True

    def replace_placeholders(self, content, date):
        """替换模板中的占位符"""
        weekday = self.weekdays_cn[date.weekday()]
        month_name = list(self.months_cn.values())[date.month - 1].split('-')[1]
        
        replacements = {
            "[日期]": f"{date.strftime('%Y年%m月%d日')}",
            "YYYY年MM月DD日 星期X": f"{date.strftime('%Y年%m月%d日')} {weekday}",
            "YYYY-MM-DD HH:mm": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "YYYY-MM-DD": date.strftime("%Y-%m-%d"),
            "2024": date.strftime("%Y"),
            "categories: [daily-plan, 2024]": f"categories: [daily-plan, {date.year}, {month_name}]"
        }
        
        for placeholder, replacement in replacements.items():
            content = content.replace(placeholder, replacement)
        
        return content

    def generate_weekly_plan(self, date=None):
        """生成周计划文件"""
        if date is None:
            date = datetime.now()
        
        # 获取本周一的日期
        monday = date - timedelta(days=date.weekday())
        sunday = monday + timedelta(days=6)
        
        # 确保目录存在
        target_dir = self.ensure_directories(monday)
        
        # 生成文件名
        week_num = monday.isocalendar()[1]
        filename = f"{monday.year}-{week_num:02d}-week-summary.md"
        filepath = os.path.join(target_dir, filename)
        
        # 读取模板
        if not os.path.exists(self.weekly_template):
            print(f"错误：模板文件不存在 {self.weekly_template}")
            return False
        
        with open(self.weekly_template, 'r', encoding='utf-8') as f:
            template_content = f.read()
        
        # 替换占位符
        content = template_content.replace("第X周", f"第{week_num}周")
        content = content.replace("YYYY年MM月DD日 - MM月DD日", 
                                f"{monday.strftime('%Y年%m月%d日')} - {sunday.strftime('%m月%d日')}")
        
        # 替换每日日期
        for i in range(7):
            day = monday + timedelta(days=i)
            content = content.replace(f"(MM-DD)", f"({day.strftime('%m-%d')})", 1)
        
        content = content.replace("YYYY-MM-DD HH:mm", datetime.now().strftime("%Y-%m-%d %H:%M"))
        
        # 写入文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ 成功生成周计划：{filepath}")
        return True

    def generate_range(self, start_date, end_date):
        """生成日期范围内的所有每日计划"""
        current = start_date
        success_count = 0
        
        while current <= end_date:
            if self.generate_daily_plan(current):
                success_count += 1
            current += timedelta(days=1)
        
        print(f"\n✅ 共成功生成 {success_count} 个每日计划文件")

    def list_existing_plans(self):
        """列出已存在的计划文件"""
        print("\n📅 已存在的计划文件：")
        
        if not os.path.exists(self.base_dir):
            print("暂无计划文件")
            return
        
        for year in sorted(os.listdir(self.base_dir)):
            year_path = os.path.join(self.base_dir, year)
            if not os.path.isdir(year_path) or year == "templates":
                continue
            
            print(f"\n📁 {year}年：")
            
            for month in sorted(os.listdir(year_path)):
                month_path = os.path.join(year_path, month)
                if not os.path.isdir(month_path):
                    continue
                
                files = [f for f in os.listdir(month_path) if f.endswith('.md')]
                if files:
                    print(f"  📂 {month}：{len(files)} 个文件")
                    for file in sorted(files)[:5]:  # 只显示前5个文件
                        print(f"    📄 {file}")
                    if len(files) > 5:
                        print(f"    ... 还有 {len(files) - 5} 个文件")

def main():
    generator = DailyPlanGenerator()
    
    if len(sys.argv) == 1:
        # 交互模式
        print("🎯 每日计划生成器")
        print("=" * 30)
        print("1. 生成今日计划")
        print("2. 生成指定日期计划")
        print("3. 生成本周计划")
        print("4. 生成日期范围计划")
        print("5. 查看已有计划")
        print("6. 退出")
        
        while True:
            choice = input("\n请选择操作 (1-6): ").strip()
            
            if choice == '1':
                generator.generate_daily_plan()
                
            elif choice == '2':
                date_str = input("请输入日期 (格式: YYYY-MM-DD): ").strip()
                try:
                    date = datetime.strptime(date_str, "%Y-%m-%d")
                    generator.generate_daily_plan(date)
                except ValueError:
                    print("❌ 日期格式错误，请使用 YYYY-MM-DD 格式")
                    
            elif choice == '3':
                generator.generate_weekly_plan()
                
            elif choice == '4':
                try:
                    start_str = input("请输入开始日期 (格式: YYYY-MM-DD): ").strip()
                    end_str = input("请输入结束日期 (格式: YYYY-MM-DD): ").strip()
                    
                    start_date = datetime.strptime(start_str, "%Y-%m-%d")
                    end_date = datetime.strptime(end_str, "%Y-%m-%d")
                    
                    if start_date > end_date:
                        print("❌ 开始日期不能晚于结束日期")
                        continue
                    
                    days_count = (end_date - start_date).days + 1
                    if days_count > 31:
                        response = input(f"⚠️ 将生成 {days_count} 个文件，确认继续？(y/N): ")
                        if response.lower() != 'y':
                            continue
                    
                    generator.generate_range(start_date, end_date)
                    
                except ValueError:
                    print("❌ 日期格式错误，请使用 YYYY-MM-DD 格式")
                    
            elif choice == '5':
                generator.list_existing_plans()
                
            elif choice == '6':
                print("👋 再见！")
                break
                
            else:
                print("❌ 无效选择，请输入 1-6")
    
    else:
        # 命令行模式
        if sys.argv[1] == 'today':
            generator.generate_daily_plan()
        elif sys.argv[1] == 'week':
            generator.generate_weekly_plan()
        elif sys.argv[1] == 'date' and len(sys.argv) > 2:
            try:
                date = datetime.strptime(sys.argv[2], "%Y-%m-%d")
                generator.generate_daily_plan(date)
            except ValueError:
                print("❌ 日期格式错误，请使用 YYYY-MM-DD 格式")
        else:
            print("用法：")
            print("  python generate-daily-plan.py          # 交互模式")
            print("  python generate-daily-plan.py today    # 生成今日计划")
            print("  python generate-daily-plan.py week     # 生成本周计划")
            print("  python generate-daily-plan.py date YYYY-MM-DD  # 生成指定日期计划")

if __name__ == "__main__":
    main()
