#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成每日计划脚本
从今天到9月2号，为数学建模比赛做准备
"""

import os
from datetime import datetime, timedelta
import calendar

def get_weekday(year, month, day):
    """获取星期几"""
    weekdays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    date = datetime(year, month, day)
    return weekdays[date.weekday()]

def format_date(year, month, day):
    """格式化日期"""
    return f"{year}年{month}月{day}日"

def get_math_modeling_content(date, weekday):
    """获取数学建模学习内容"""
    # 计算距离比赛的天数
    competition_date = datetime(2025, 9, 3)
    days_until_competition = (competition_date - date).days
    
    # 根据剩余天数安排学习内容
    if days_until_competition >= 6:
        # 第一阶段：基础学习（前10天学习10章内容）
        day_in_phase = 17 - days_until_competition
        if day_in_phase == 0 or day_in_phase == 1:
            return "学习数学建模绪论，距离比赛还有17天"
        elif day_in_phase == 2:
            return "学习解析方法与几何模型，距离比赛还有16天"
        elif day_in_phase == 3:
            return "学习微分方程与动力系统，距离比赛还有15天"
        elif day_in_phase == 4:
            return "学习函数极值与规划模型，距离比赛还有14天"
        elif day_in_phase == 5:
            return "学习复杂网络与图论模型，距离比赛还有13天"
        elif day_in_phase == 6:
            return "学习进化计算与群体智能，距离比赛还有12天"
        elif day_in_phase == 7:
            return "学习数据处理与拟合模型，距离比赛还有11天"
        elif day_in_phase == 8:
            return "学习统计建模与机器学习，距离比赛还有10天"
        elif day_in_phase == 9:
            return "学习优化算法与数值方法，距离比赛还有9天"
        elif day_in_phase == 10:
            return "学习建模实践与案例分析，距离比赛还有8天"
        elif day_in_phase == 11:
            return "学习竞赛技巧与总结，距离比赛还有7天"
        else:
            return "复习巩固前面章节，距离比赛还有6天"
    elif days_until_competition >= 3:
        # 第二阶段：模拟练习（第12-15天）
        day_in_phase = 15 - days_until_competition
        if day_in_phase == 1:
            return "做模拟题练习1，距离比赛还有4天"
        elif day_in_phase == 2:
            return "做模拟题练习2，距离比赛还有3天"
        else:
            return f"做模拟题练习，距离比赛还有{days_until_competition}天"
    else:
        # 第三阶段：冲刺复习（第16-17天）
        return f"冲刺复习，距离比赛还有{days_until_competition}天"

def get_math_modeling_details(date, weekday):
    """获取数学建模学习详细内容"""
    # 计算距离比赛的天数
    competition_date = datetime(2025, 9, 3)
    days_until_competition = (competition_date - date).days
    
    # 基础学习阶段：前10天学习10章内容
    if days_until_competition >= 6:
        # 计算在基础学习阶段中的第几天
        day_in_phase = 17 - days_until_competition
        
        if day_in_phase == 0 or day_in_phase == 1:
            return {
                "chapter": "绪论：走进数学建模的大门",
                "focus": "数学建模的基本概念、方法和应用",
                "tasks": "阅读绪论，理解数学建模的意义",
                "goal": "建立对数学建模的整体认识"
            }
        elif day_in_phase == 2:
            return {
                "chapter": "第1章：解析方法与几何模型",
                "focus": "解析方法、几何模型的基本概念",
                "tasks": "完成第1章的练习题和思考题",
                "goal": "掌握解析方法和几何模型"
            }
        elif day_in_phase == 3:
            return {
                "chapter": "第2章：微分方程与动力系统",
                "focus": "微分方程、动力系统的基本概念",
                "tasks": "完成第2章的练习题和思考题",
                "goal": "理解微分方程与动力系统"
            }
        elif day_in_phase == 4:
            return {
                "chapter": "第3章：函数极值与规划模型",
                "focus": "函数极值、规划模型的基本方法",
                "tasks": "完成第3章的练习题和思考题",
                "goal": "掌握函数极值与规划模型"
            }
        elif day_in_phase == 5:
            return {
                "chapter": "第4章：复杂网络与图论模型",
                "focus": "复杂网络、图论模型的基本概念",
                "tasks": "完成第4章的练习题和思考题",
                "goal": "理解复杂网络与图论模型"
            }
        elif day_in_phase == 6:
            return {
                "chapter": "第5章：进化计算与群体智能",
                "focus": "进化算法、群体智能的基本原理",
                "tasks": "完成第5章的练习题和思考题",
                "goal": "掌握进化计算与群体智能"
            }
        elif day_in_phase == 7:
            return {
                "chapter": "第6章：数据处理与拟合模型",
                "focus": "数据处理、拟合模型的基本方法",
                "tasks": "完成第6章的练习题和思考题",
                "goal": "掌握数据处理与拟合模型"
            }
        elif day_in_phase == 8:
            return {
                "chapter": "第7章：统计建模与机器学习",
                "focus": "统计建模、机器学习的基本原理",
                "tasks": "完成第7章的练习题和思考题",
                "goal": "理解统计建模与机器学习"
            }
        elif day_in_phase == 9:
            return {
                "chapter": "第8章：优化算法与数值方法",
                "focus": "优化算法、数值方法的基本概念",
                "tasks": "完成第8章的练习题和思考题",
                "goal": "掌握优化算法与数值方法"
            }
        elif day_in_phase == 10:
            return {
                "chapter": "第9章：建模实践与案例分析",
                "focus": "实际建模案例的分析和解决",
                "tasks": "分析案例，总结建模思路",
                "goal": "提高实际建模能力"
            }
        elif day_in_phase == 11:
            return {
                "chapter": "第10章：竞赛技巧与总结",
                "focus": "数学建模竞赛的技巧和注意事项",
                "tasks": "学习竞赛技巧，做好总结",
                "goal": "为竞赛做好充分准备"
            }
        else:
            return {
                "chapter": "复习巩固",
                "focus": "复习前面章节的重点内容",
                "tasks": "复习薄弱环节，巩固知识点",
                "goal": "巩固已学知识"
            }
    elif days_until_competition >= 6:
        return {
            "chapter": "模拟题练习",
            "focus": "综合运用所学知识",
            "tasks": "完成模拟题，分析解题思路",
            "goal": "提高实战能力"
        }
    else:
        return {
            "chapter": "冲刺复习",
            "focus": "查漏补缺，重点突破",
            "tasks": "复习薄弱环节，做最后准备",
            "goal": "以最佳状态迎接比赛"
        }

def get_english_learning_content(date, day_of_week):
    """获取英语学习内容"""
    # 根据日期安排不同的英语学习内容
    day_of_year = date.timetuple().tm_yday
    
    # 循环安排不同的英语学习内容
    content_types = [
        "雅思听力练习：完成一个听力Section",
        "雅思阅读练习：完成一篇阅读文章",
        "雅思写作练习：写一篇小作文",
        "雅思口语练习：练习Part1话题",
        "词汇积累：背诵雅思核心词汇",
        "语法复习：重点语法点练习"
    ]
    
    content_index = (day_of_year - 1) % len(content_types)
    return content_types[content_index]

def generate_daily_plan(date):
    """生成单日计划"""
    year = date.year
    month = date.month
    day = date.day
    weekday = get_weekday(year, month, day)
    formatted_date = format_date(year, month, day)
    
    # 获取数学建模学习内容
    math_content = get_math_modeling_content(date, weekday)
    math_details = get_math_modeling_details(date, weekday)
    english_content = get_english_learning_content(date, weekday)
    
    # 根据星期几调整计划
    if weekday in ['星期六', '星期日']:
        # 周末可以多安排一些学习时间
        study_time = "9:00 - 12:00"
        english_time = "14:00 - 15:30"
        reading_time = "15:30 - 17:00"
    else:
        # 工作日
        study_time = "10:00 - 12:00"
        english_time = "14:00 - 15:00"
        reading_time = "15:30 - 16:30"
    
    plan_content = f"""# 📅 今日计划

**🌤️ 天气：待填写，温度 待填写°C，待填写**

## 🎯 今日重点任务

### 📚 数学建模学习 (9:00 - 12:00)
- [ ] **{math_content}**
  - 阅读 [DataWhale数学建模教程](https://datawhalechina.github.io/intro-mathmodel/#/) {math_details['chapter']}
  - 重点学习：{math_details['focus']}
  - {math_details['tasks']}
  - 预计用时：2-3小时
  - 学习目标：{math_details['goal']}

### 📖 英语学习 (14:00 - 15:00)
- [ ] **{english_content}**
  - 完成相应的练习和作业
  - 记录学习心得和难点
  - 预计用时：1-1.5小时
  - 学习目标：提高雅思听说读写综合能力

### 📚 课外阅读 (15:30 - 16:30)
- [ ] **阅读课外书籍**
  - 选择一本感兴趣的书籍
  - 做好读书笔记
  - 预计用时：1-1.5小时
  - 学习目标：拓展知识面

## 🌞 生活安排

### 🍽️ 用餐时间
- [ ] **早餐** (8:00 - 8:30)
- [ ] **午餐** (12:00 - 12:30)
- [ ] **晚餐** (18:00 - 18:30)

### ☀️ 户外活动
- [ ] **晒太阳** (16:30 - 17:00)
  - 在校园里散步
  - 呼吸新鲜空气
  - 放松身心

### 🎮 休闲时间
- [ ] **休闲娱乐** (19:00 - 20:00)
  - 听音乐、看视频
  - 与朋友聊天
  - 放松大脑

## 🌙 晚间总结

### 📝 今日总结 (21:00 - 21:30)
- [ ] **回顾今日完成情况**
  - 检查学习任务完成度
  - 记录学习收获
  - 总结遇到的问题

### 📋 明日计划 (21:30 - 22:00)
- [ ] **制定明日计划**
  - 根据今日进度调整
  - 安排明日重点任务
  - 准备学习材料

## 📊 今日目标

### 🎯 主要目标
- 完成数学建模学习任务
- 完成英语学习任务
- 保持良好作息

### 📈 学习指标
- 数学建模：{math_details['goal']}
- 英语：{english_content}
- 阅读：完成阅读任务

---

## 💡 学习笔记

### 📚 数学建模学习心得
- 

### 🆎 英语学习记录
- 

### 📖 阅读感悟
- 

---

## 🌟 今日亮点
- 

## 🔄 需要改进
- 

## ⏭️ 明日重点
- [ ] 继续数学建模学习
- [ ] 继续英语学习
- [ ] 调整学习计划

---

## 📋 任务状态说明
- `- [ ]` = 未开始
- `- [x]` = 已完成
- `- [~]` = 部分完成
- `- [!]` = 已取消
- `- [>]` = 进行中
- `- [?]` = 需要帮助
"""
    
    return plan_content

def main():
    """主函数"""
    print("开始生成每日计划...")
    
    # 获取今天的日期
    today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    target_date = datetime(2025, 9, 2)
    
    # 确保目录存在
    base_dir = "daily-plans"
    if not os.path.exists(base_dir):
        os.makedirs(base_dir)
    
    # 生成从今天到9月2号的计划
    current_date = today
    plan_count = 0
    
    # 计算总天数
    total_days = (target_date - today).days + 1
    
    for i in range(total_days):
        current_date = today + timedelta(days=i)
        year = current_date.year
        month = current_date.month
        day = current_date.day
        
        # 创建年月目录
        year_dir = os.path.join(base_dir, str(year))
        month_dir = os.path.join(year_dir, f"{month:02d}")
        
        os.makedirs(month_dir, exist_ok=True)
        
        # 生成计划文件
        plan_file = os.path.join(month_dir, f"{day:02d}.md")
        plan_content = generate_daily_plan(current_date)
        
        with open(plan_file, 'w', encoding='utf-8') as f:
            f.write(plan_content)
        
        print(f"✅ 生成计划: {year}年{month:02d}月{day:02d}日 {get_weekday(year, month, day)}")
        plan_count += 1
    
    print(f"\n🎉 计划生成完成！")
    print(f"📅 总共生成了 {plan_count} 天的计划")
    print(f"📁 文件保存在 {base_dir} 目录下")
    
    # 更新导航数据
    print("\n🔄 正在更新导航数据...")
    os.system("python3 generate-nav.py")
    
    print("\n✨ 所有工作完成！现在可以查看生成的计划了。")

if __name__ == "__main__":
    main()
