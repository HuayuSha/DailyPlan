// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 设置当前周的日期
    setCurrentWeekDates();
    
    // 加载保存的任务状态
    loadTaskStates();
    
    // 为复选框添加事件监听器
    addCheckboxListeners();
    
    // 加载自定义模板
    loadCustomTemplates();
});

// 设置当前周的日期
function setCurrentWeekDates() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = 周日, 1 = 周一, ...
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    
    days.forEach((day, index) => {
        const dateElement = document.getElementById(day + '-date');
        if (dateElement) {
            const currentDate = new Date(monday);
            currentDate.setDate(monday.getDate() + index);
            
            const month = currentDate.getMonth() + 1;
            const date = currentDate.getDate();
            dateElement.textContent = `${month}月${date}日`;
            
            // 高亮今天
            if (currentDate.toDateString() === today.toDateString()) {
                dateElement.parentElement.classList.add('today');
                dateElement.style.color = '#ff6b6b';
                dateElement.style.fontWeight = 'bold';
            }
        }
    });
}

// 为复选框添加事件监听器
function addCheckboxListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveTaskStates();
            updateProgress();
        });
    });
}

// 保存任务状态到本地存储
function saveTaskStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const states = {};
    
    checkboxes.forEach(checkbox => {
        states[checkbox.id] = checkbox.checked;
    });
    
    localStorage.setItem('taskStates', JSON.stringify(states));
}

// 加载保存的任务状态
function loadTaskStates() {
    const savedStates = localStorage.getItem('taskStates');
    if (savedStates) {
        const states = JSON.parse(savedStates);
        
        Object.keys(states).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = states[id];
            }
        });
    }
}

// 更新进度统计
function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const completed = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const total = checkboxes.length;
    
    // 可以在这里添加进度显示逻辑
    console.log(`完成进度: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
}

// 清空所有任务
function clearAllTasks() {
    if (confirm('确定要清空所有任务的完成状态吗？')) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        saveTaskStates();
        updateProgress();
    }
}

// 导出本周计划
function exportWeekPlan() {
    const weekData = {
        week: getCurrentWeekString(),
        tasks: []
    };
    
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach(card => {
        const dayName = card.querySelector('h3').textContent;
        const date = card.querySelector('.date').textContent;
        const tasks = [];
        
        const taskItems = card.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const label = item.querySelector('label');
            tasks.push({
                task: label.textContent,
                completed: checkbox.checked
            });
        });
        
        weekData.tasks.push({
            day: dayName,
            date: date,
            tasks: tasks
        });
    });
    
    const dataStr = JSON.stringify(weekData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `weekly-plan-${getCurrentWeekString()}.json`;
    link.click();
}

// 获取当前周字符串
function getCurrentWeekString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
}

// 显示统计信息
function showStats() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const completed = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const total = checkboxes.length;
    const percentage = Math.round(completed/total*100);
    
    const dayStats = {};
    const dayCards = document.querySelectorAll('.day-card');
    
    dayCards.forEach(card => {
        const dayName = card.querySelector('h3').textContent;
        const dayCheckboxes = card.querySelectorAll('input[type="checkbox"]');
        const dayCompleted = card.querySelectorAll('input[type="checkbox"]:checked').length;
        const dayTotal = dayCheckboxes.length;
        const dayPercentage = dayTotal > 0 ? Math.round(dayCompleted/dayTotal*100) : 0;
        
        dayStats[dayName] = {
            completed: dayCompleted,
            total: dayTotal,
            percentage: dayPercentage
        };
    });
    
    let statsMessage = `📊 本周完成统计\n\n总体进度: ${completed}/${total} (${percentage}%)\n\n每日详情:\n`;
    
    Object.keys(dayStats).forEach(day => {
        const stats = dayStats[day];
        statsMessage += `${day}: ${stats.completed}/${stats.total} (${stats.percentage}%)\n`;
    });
    
    alert(statsMessage);
}

// 应用模板功能
function applyTemplate(templateType) {
    const templates = {
        workday: {
            morning: ['起床 & 洗漱', '晨间锻炼 30分钟', '健康早餐', '回顾今日目标'],
            work: ['查看邮件和消息', '处理重要任务', '团队会议/沟通', '完成日常工作任务'],
            evening: ['晚餐时间', '个人学习 1小时', '休闲娱乐', '准备明日计划']
        },
        weekend: {
            morning: ['自然醒来', '悠闲早餐', '轻度运动或散步'],
            afternoon: ['个人爱好活动', '家务整理', '社交活动', '户外活动'],
            evening: ['家庭聚餐', '与家人交流', '看电影或阅读']
        },
        learning: {
            daily: ['阅读 30 分钟', '技能练习 1 小时', '知识笔记整理', '反思学习收获']
        },
        health: {
            daily: ['晨间锻炼 30 分钟', '健康饮食记录', '充足水分摄入', '保证 7-8 小时睡眠']
        }
    };
    
    if (templates[templateType]) {
        alert(`已应用 ${templateType} 模板！\n\n请根据模板内容更新您的计划。`);
    }
}

// 保存自定义模板
function saveCustomTemplate() {
    const name = document.getElementById('template-name').value.trim();
    const content = document.getElementById('template-content').value.trim();
    
    if (!name || !content) {
        alert('请填写模板名称和内容');
        return;
    }
    
    const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '{}');
    customTemplates[name] = content;
    
    localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
    
    // 清空表单
    document.getElementById('template-name').value = '';
    document.getElementById('template-content').value = '';
    
    alert('自定义模板保存成功！');
    loadCustomTemplates();
}

// 加载自定义模板
function loadCustomTemplates() {
    const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '{}');
    const customSection = document.querySelector('.custom-template');
    
    if (customSection && Object.keys(customTemplates).length > 0) {
        let templatesHTML = '<h4>我的自定义模板</h4>';
        
        Object.keys(customTemplates).forEach(name => {
            templatesHTML += `
                <div class="saved-template">
                    <h5>${name}</h5>
                    <pre>${customTemplates[name]}</pre>
                    <button onclick="deleteCustomTemplate('${name}')">删除</button>
                </div>
            `;
        });
        
        const existingTemplates = customSection.querySelector('.saved-templates');
        if (existingTemplates) {
            existingTemplates.innerHTML = templatesHTML;
        } else {
            const templatesDiv = document.createElement('div');
            templatesDiv.className = 'saved-templates';
            templatesDiv.innerHTML = templatesHTML;
            customSection.appendChild(templatesDiv);
        }
    }
}

// 删除自定义模板
function deleteCustomTemplate(name) {
    if (confirm(`确定要删除模板 "${name}" 吗？`)) {
        const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '{}');
        delete customTemplates[name];
        localStorage.setItem('customTemplates', JSON.stringify(customTemplates));
        loadCustomTemplates();
    }
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(event) {
    // Ctrl + S 保存
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveTaskStates();
        alert('任务状态已保存！');
    }
    
    // Ctrl + E 导出
    if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        exportWeekPlan();
    }
});

// 添加拖拽排序功能（可选）
function enableDragAndDrop() {
    const taskLists = document.querySelectorAll('.tasks ul');
    
    taskLists.forEach(list => {
        new Sortable(list, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: function() {
                saveTaskStates();
            }
        });
    });
}

// 主题切换功能
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 加载保存的主题
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}
