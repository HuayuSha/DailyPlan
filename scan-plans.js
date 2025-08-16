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
            
            // 尝试扫描根目录
            const rootData = await this.scanDirectory('./daily-plans/');
            if (rootData && Object.keys(rootData).length > 0) {
                this.plansData = rootData;
                return this.plansData;
            }

            // 如果根目录扫描失败，尝试扫描子目录
            const subdirData = await this.scanSubdirectories();
            if (subdirData && Object.keys(subdirData).length > 0) {
                this.plansData = subdirData;
                return this.plansData;
            }

            // 如果都失败，返回空数据
            console.warn('无法扫描到任何计划文件');
            return {};

        } catch (error) {
            console.error('扫描计划文件失败:', error);
            return {};
        }
    }

    // 扫描子目录
    async scanSubdirectories() {
        const data = {};
        
        // 尝试扫描年份目录
        for (let year = 2020; year <= 2030; year++) {
            try {
                const yearData = await this.scanDirectory(`./daily-plans/${year}/`);
                if (yearData && Object.keys(yearData).length > 0) {
                    data[year.toString()] = yearData;
                }
            } catch (e) {
                // 忽略不存在的年份目录
            }
        }

        return data;
    }

    // 扫描单个目录
    async scanDirectory(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                return null;
            }

            const html = await response.text();
            return this.parseDirectoryListing(html, path);

        } catch (error) {
            console.warn(`扫描目录 ${path} 失败:`, error);
            return null;
        }
    }

    // 解析目录列表HTML
    parseDirectoryListing(html, basePath) {
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

            // 处理年份目录 (YYYY/)
            if (href.match(/^\d{4}\/$/)) {
                const year = href.replace('/', '');
                data[year] = {};
                continue;
            }

            // 处理月份目录 (MM-MonthName/)
            if (href.match(/^\d{2}-[A-Za-z]+\/$/)) {
                const month = href.split('-')[0];
                const monthName = href.split('-')[1].replace('/', '');
                
                // 找到对应的年份
                const year = this.findYearForMonth(basePath);
                if (year && !data[year]) {
                    data[year] = {};
                }
                if (year && !data[year][month]) {
                    data[year][month] = {};
                }
                continue;
            }

            // 处理日期文件 (YYYY-MM-DD.md)
            if (href.match(/^\d{4}-\d{2}-\d{2}\.md$/)) {
                const [year, month, date] = href.split('-');
                const day = date.replace('.md', '');
                
                if (!data[year]) data[year] = {};
                if (!data[year][month]) data[year][month] = {};
                
                data[year][month][day] = {
                    title: `${year}年${month}月${day}日 - 每日计划`,
                    content: `点击查看 ${year}年${month}月${day}日 的详细计划内容...`,
                    file_path: `${basePath}${href}`,
                    full_path: `${basePath}${href}`,
                    filename: href
                };
            }
        }
        
        return data;
    }

    // 根据路径找到年份
    findYearForMonth(path) {
        const yearMatch = path.match(/\/daily-plans\/(\d{4})\//);
        return yearMatch ? yearMatch[1] : null;
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
