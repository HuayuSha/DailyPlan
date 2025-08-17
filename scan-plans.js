// 扫描计划文件的JavaScript模块
class PlansScanner {
    constructor() {
        this.plansData = {};
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
    }

    // 扫描daily-plans目录
    async scanPlansDirectory() {
        console.log('开始扫描计划目录...');
        
        // 不依赖目录列表，直接检查已知的文件
        const plansData = {};
        
        // 获取当前年份
        const currentYear = new Date().getFullYear();
        
        // 扫描最近几年的数据
        for (let year = currentYear; year >= currentYear - 2; year--) {
            const yearData = await this.scanYearDirectoriesByFiles(year.toString());
            if (yearData && Object.keys(yearData).length > 0) {
                plansData[year.toString()] = yearData;
            }
        }
        
        console.log('扫描完成，找到数据:', plansData);
        return plansData;
    }

    // 通过直接检查文件来扫描年份目录
    async scanYearDirectoriesByFiles(year) {
        const yearData = {};
        
        // 检查12个月份
        for (let month = 1; month <= 12; month++) {
            const monthStr = String(month).padStart(2, '0');
            const monthData = await this.scanMonthByFiles(year, monthStr);
            if (monthData && Object.keys(monthData).length > 0) {
                yearData[monthStr] = monthData;
            }
        }
        
        return yearData;
    }

    // 通过直接检查文件来扫描月份
    async scanMonthByFiles(year, month) {
        const monthData = {};
        
        // 检查31天（最大天数）
        for (let day = 1; day <= 31; day++) {
            const dayStr = String(day).padStart(2, '0');
            
            // 尝试多种可能的路径
            const possiblePaths = [
                `./daily-plans/${year}/${month}/${dayStr}.md`,
                `daily-plans/${year}/${month}/${dayStr}.md`,
                `/daily-plans/${year}/${month}/${dayStr}.md`,
                `${window.location.pathname.replace(/\/$/, '')}/daily-plans/${year}/${month}/${dayStr}.md`
            ];
            
            let fileExists = false;
            
            for (const path of possiblePaths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) {
                        fileExists = true;
                        console.log(`找到文件: ${year}/${month}/${dayStr}.md`);
                        break;
                    }
                } catch (e) {
                    // 忽略错误，继续尝试下一个路径
                }
            }
            
            if (fileExists) {
                // 根据文件夹结构生成完整日期
                const fullDate = this.generateFullDate(year, month, dayStr);
                const weekday = this.getWeekday(fullDate);
                const formattedDate = this.formatDate(fullDate);
                
                monthData[dayStr] = {
                    title: `每日计划 - ${dayStr}日`,
                    content: `点击查看 ${formattedDate} ${weekday} 的详细计划内容...`,
                    file_path: `daily-plans/${year}/${month}/${dayStr}.md`,
                    full_path: `./daily-plans/${year}/${month}/${dayStr}.md`,
                    filename: `${dayStr}.md`,
                    day: dayStr,
                    month: month,
                    year: year,
                    fullDate: fullDate,
                    weekday: weekday,
                    formattedDate: formattedDate
                };
            }
        }
        
        return monthData;
    }

    // 扫描年份目录
    async scanYearDirectory(basePath, year) {
        try {
            const yearPath = `${basePath}${year}/`;
            const response = await fetch(yearPath);
            if (!response.ok) {
                console.log(`无法访问年份目录: ${yearPath}`);
                return {};
            }
            
            const html = await response.text();
            return await this.parseYearDirectory(html, year);
        } catch (error) {
            console.error(`扫描年份目录失败: ${yearPath}`, error);
            return {};
        }
    }

    // 解析年份目录
    async parseYearDirectory(html, year) {
        const data = {};
        
        // 检查12个月份
        for (let month = 1; month <= 12; month++) {
            const monthStr = String(month).padStart(2, '0');
            const monthData = await this.scanMonthByFiles(year, monthStr);
            if (monthData && Object.keys(monthData).length > 0) {
                data[monthStr] = monthData;
            }
        }
        
        return data;
    }

    // 扫描月份目录
    async scanMonthDirectory(basePath, year, month, monthData) {
        try {
            const monthPath = `${basePath}${year}/${month}/`;
            const response = await fetch(monthPath);
            if (!response.ok) {
                console.log(`无法访问月份目录: ${monthPath}`);
                return;
            }
            
            const html = await response.text();
            return await this.parseMonthDirectory(html, monthData, year, month);
        } catch (error) {
            console.error(`扫描月份目录失败: ${monthPath}`, error);
        }
    }

    // 解析月份目录
    parseMonthDirectory(html, monthData, year, month) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a[href]');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.endsWith('.md')) {
                const day = href.replace('.md', '');
                console.log(`找到计划文件: ${day}.md`);
                
                // 根据文件夹结构生成完整日期
                const fullDate = this.generateFullDate(year, month, day);
                const weekday = this.getWeekday(fullDate);
                const formattedDate = this.formatDate(fullDate);
                
                monthData[day] = {
                    title: `每日计划 - ${day}日`, // This title is for sidebar display, not page content
                    content: `点击查看 ${formattedDate} ${weekday} 的详细计划内容...`,
                    file_path: `daily-plans/${year}/${month}/${href}`,
                    full_path: `./daily-plans/${year}/${month}/${href}`,
                    filename: href,
                    day: day,
                    month: month,
                    year: year,
                    fullDate: fullDate,
                    weekday: weekday,
                    formattedDate: formattedDate
                };
            }
        });
        
        return monthData;
    }

    // 根据年月日生成完整日期对象
    generateFullDate(year, month, day) {
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    // 获取星期几
    getWeekday(date) {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return weekdays[date.getDay()];
    }

    // 格式化日期
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }

    // 获取计划内容
    async getPlanContent(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            return this.parseMarkdown(content);
            
        } catch (error) {
            console.error(`获取计划内容失败 ${filePath}:`, error);
            return '无法加载计划内容';
        }
    }

    // 解析Markdown内容
    parseMarkdown(markdown) {
        // 移除front matter
        let content = markdown.replace(/^---[\s\S]*?---/, '');
        
        // 简单的markdown到HTML转换
        content = content
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            // 处理链接 [text](url) - 修复正则表达式以支持中文
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
                return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
            })
            // 处理任务列表
            .replace(/^- \[ \] (.*$)/gm, '<div class="task-item"><input type="checkbox" disabled> <span>$1</span></div>')
            .replace(/^- \[x\] (.*$)/gm, '<div class="task-item"><input type="checkbox" checked disabled> <span>$1</span></div>')
            // 处理普通列表
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            // 处理水平线
            .replace(/^---$/gm, '<hr>')
            // 处理段落
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        
        // 包装在段落标签中
        content = '<p>' + content + '</p>';
        
        // 清理空的段落标签
        content = content.replace(/<p><\/p>/g, '');
        
        return content;
    }

    // 获取统计信息
    getStats() {
        let totalPlans = 0;
        let yearCount = 0;
        let monthCount = 0;

        for (const year in this.plansData) {
            yearCount++;
            for (const month in this.plansData[year]) {
                monthCount++;
                totalPlans += Object.keys(this.plansData[year][month]).length;
            }
        }

        return {
            totalPlans,
            yearCount,
            monthCount
        };
    }

    // 搜索计划
    searchPlans(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();

        for (const year in this.plansData) {
            for (const month in this.plansData[year]) {
                for (const date in this.plansData[year][month]) {
                    const plan = this.plansData[year][month][date];
                    if (plan.title.toLowerCase().includes(lowerQuery) || 
                        plan.content.toLowerCase().includes(lowerQuery)) {
                        results.push({
                            ...plan,
                            year,
                            month,
                            date
                        });
                    }
                }
            }
        }

        return results;
    }
}

// 导出扫描器类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlansScanner;
} else {
    window.PlansScanner = PlansScanner;
}
