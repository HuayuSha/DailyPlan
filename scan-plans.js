// 扫描计划文件的JavaScript模块
class PlansScanner {
    constructor() {
        this.plansData = {};
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
    }

    // 扫描daily-plans目录
    async scanPlansDirectory() {
        try {
            console.log('开始扫描计划文件...');
            
            // 直接扫描年份目录
            const yearData = await this.scanYearDirectories();
            if (yearData && Object.keys(yearData).length > 0) {
                this.plansData = yearData;
                console.log('扫描完成，找到数据:', this.plansData);
                return this.plansData;
            }

            console.warn('无法扫描到任何计划文件');
            return {};

        } catch (error) {
            console.error('扫描计划文件失败:', error);
            return {};
        }
    }

    // 扫描年份目录
    async scanYearDirectories() {
        const data = {};
        
        // 扫描2024年目录
        try {
            const year2024Data = await this.scanYearDirectory('2024');
            if (year2024Data && Object.keys(year2024Data).length > 0) {
                data['2024'] = year2024Data;
            }
        } catch (e) {
            console.warn('扫描2024年目录失败:', e);
        }

        // 扫描其他年份目录
        for (let year = 2020; year <= 2030; year++) {
            if (year === 2024) continue; // 已经扫描过了
            
            try {
                const yearData = await this.scanYearDirectory(year.toString());
                if (yearData && Object.keys(yearData).length > 0) {
                    data[year.toString()] = yearData;
                }
            } catch (e) {
                // 忽略不存在的年份目录
            }
        }

        return data;
    }

    // 扫描单个年份目录
    async scanYearDirectory(year) {
        try {
            const yearPath = `./daily-plans/${year}/`;
            const response = await fetch(yearPath);
            if (!response.ok) {
                return null;
            }

            const html = await response.text();
            return await this.parseYearDirectory(html, year);

        } catch (error) {
            console.warn(`扫描年份目录 ${year} 失败:`, error);
            return null;
        }
    }

    // 解析年份目录
    async parseYearDirectory(html, year) {
        const data = {};
        const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
        let match;
        
        while ((match = linkRegex.exec(html)) !== null) {
            const href = match[1];
            const text = match[2].trim();
            
            // 跳过父目录链接和当前目录
            if (href === '../' || href === './' || href === '') {
                continue;
            }

            // 处理月份目录 (MM/)
            if (href.match(/^\d{2}\/$/)) {
                const month = href.replace('/', '');
                data[month] = {};
                
                // 扫描月份目录下的文件 - 等待完成
                await this.scanMonthDirectory(year, month, data[month]);
            }
        }
        
        return data;
    }

    // 扫描月份目录
    async scanMonthDirectory(year, month, monthData) {
        try {
            const monthPath = `./daily-plans/${year}/${month}/`;
            console.log(`正在扫描月份目录: ${monthPath}`);
            
            const response = await fetch(monthPath);
            if (!response.ok) {
                console.warn(`月份目录 ${monthPath} 访问失败`);
                return;
            }

            const html = await response.text();
            console.log(`月份目录 ${monthPath} 内容:`, html.substring(0, 200) + '...');
            
            this.parseMonthDirectory(html, monthData, year, month);
            console.log(`月份目录 ${monthPath} 解析完成，找到 ${Object.keys(monthData).length} 个文件`);

        } catch (error) {
            console.warn(`扫描月份目录 ${year}/${month} 失败:`, error);
        }
    }

    // 解析月份目录
    parseMonthDirectory(html, monthData, year, month) {
        const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
        let match;
        
        while ((match = linkRegex.exec(html)) !== null) {
            const href = match[1];
            const text = match[2].trim();
            
            // 跳过父目录链接和当前目录
            if (href === '../' || href === './' || href === '') {
                continue;
            }

            // 处理日期文件 (DD.md)
            if (href.match(/^\d{1,2}\.md$/)) {
                const day = href.replace('.md', '');
                console.log(`找到计划文件: ${day}.md`);
                
                // 根据文件夹结构生成完整日期
                const fullDate = this.generateFullDate(year, month, day);
                const weekday = this.getWeekday(fullDate);
                const formattedDate = this.formatDate(fullDate);
                
                monthData[day] = {
                    title: `每日计划 - ${day}日`,
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
        }
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
            .replace(/\n/g, '<br>');
        
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
