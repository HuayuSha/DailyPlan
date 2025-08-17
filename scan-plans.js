// 扫描计划文件的JavaScript模块
class PlansScanner {
    constructor() {
        this.plansData = {};
        this.baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');
    }

    // 扫描daily-plans目录
    async scanPlansDirectory() {
        console.log('开始扫描计划目录...');
        
        // 尝试多种可能的路径
        const possiblePaths = [
            './daily-plans/',
            'daily-plans/',
            '/daily-plans/',
            `${window.location.pathname.replace(/\/$/, '')}/daily-plans/`
        ];
        
        let plansData = {};
        
        for (const basePath of possiblePaths) {
            try {
                console.log('尝试扫描路径:', basePath);
                const response = await fetch(basePath);
                if (response.ok) {
                    console.log('成功访问目录:', basePath);
                    plansData = await this.scanYearDirectories(basePath);
                    if (Object.keys(plansData).length > 0) {
                        console.log('成功扫描到计划数据，使用路径:', basePath);
                        this.basePath = basePath; // 保存工作路径
                        break;
                    }
                }
            } catch (error) {
                console.log('路径失败:', basePath, error);
            }
        }
        
        if (Object.keys(plansData).length === 0) {
            console.log('所有路径都无法访问，返回空数据');
        }
        
        return plansData;
    }

    // 扫描年份目录
    async scanYearDirectories(basePath) {
        const data = {};
        
        // 扫描2024年目录
        try {
            const year2024Data = await this.scanYearDirectory(basePath, '2024');
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
                const yearData = await this.scanYearDirectory(basePath, year.toString());
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
    async scanYearDirectory(basePath, year) {
        try {
            const yearPath = `${basePath}${year}/`;
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
                await this.scanMonthDirectory(basePath, year, month, data[month]);
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
