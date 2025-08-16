---
layout: default
title: 我的每日计划系统
---

# 📅 我的每日计划系统

欢迎来到我的个人每日计划管理系统！这里记录了我每天的计划、目标和反思。

## 🎯 快速导航

- [📋 所有每日计划](plans.html) - 查看所有的每日计划记录
- [🎯 长期目标](daily-plans/goals.html) - 我的长期目标和规划
- [📝 计划模板](daily-plans/templates/) - 每日和每周计划模板

## 📊 最近的计划

{% assign recent_plans = site.daily-plans | sort: 'date' | reverse | limit: 5 %}
{% for plan in recent_plans %}
  {% if plan.title %}
- [{{ plan.title }}]({{ plan.url | relative_url }}) - {{ plan.date | date: "%Y年%m月%d日" }}
  {% endif %}
{% endfor %}

## 🌟 使用说明

1. **创建每日计划**: 使用 `generate-daily-plan.py` 脚本快速生成新的每日计划文件
2. **记录日常**: 在每个 Markdown 文件中记录你的计划、任务和反思
3. **追踪进度**: 使用 `- [ ]` 和 `- [x]` 来标记任务完成状态
4. **定期回顾**: 通过网页界面查看历史记录和进度统计

## 🚀 快速开始

### 生成今日计划
```bash
python generate-daily-plan.py today
```

### 生成指定日期计划
```bash
python generate-daily-plan.py date 2024-01-20
```

### 生成本周计划
```bash
python generate-daily-plan.py week
```

---

> 💡 **提示**: 每个每日计划文件都包含了详细的任务分类、时间安排和反思空间，帮助你更好地规划和追踪每一天。

**最后更新**: {{ site.time | date: "%Y年%m月%d日" }}
