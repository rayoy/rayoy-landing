/**
 * Comprehensive i18n translations for ALL app pages.
 * Covers: Landing, Pricing, Success, Analysis, Dashboard, Chat, Profile.
 */
import type { Locale } from './i18n';

export interface AppTranslations {
    // Landing page
    landing: {
        badge: string;
        heroTitle1: string;
        heroTitle2: string;
        heroDescription: string;
        ctaSignedIn: string;
        ctaSignedOut: string;
        ctaTryFree: string;
        // Stats bar
        statsReadings: string;
        statsAccuracy: string;
        statsCountries: string;
        // How It Works
        howItWorksTitle: string;
        howItWorksSubtitle: string;
        howItWorksSteps: { step: string; title: string; description: string }[];
        // Features
        sectionTitle: string;
        sectionDescription: string;
        features: { title: string; description: string }[];
        // Report Preview
        reportPreviewTitle: string;
        reportPreviewSubtitle: string;
        reportLabels: { phase: string; trend: string; risk: string; action: string };
        reportValues: { phase: string; trend: string; risk: string; action: string };
        // Testimonials
        testimonialsTitle: string;
        testimonials: { quote: string; name: string; title: string }[];
        // FAQ
        faqTitle: string;
        faqItems: { q: string; a: string }[];
        // Try CTA
        tryCta: string;
        tryCtaDescription: string;
        tryCtaButton: string;
        // Footer
        footerCopyright: string;
        footerLinks: { terms: string; privacy: string; disclaimer: string; refund: string; contact: string };
    };
    // Pricing page
    pricing: {
        back: string;
        title: string;
        description: string;
        mostPopular: string;
        processing: string;
        plans: {
            name: string;
            description: string;
            features: string[];
            buttonText: string;
        }[];
    };
    // Success page
    success: {
        title: string;
        description: string;
        ctaDashboard: string;
        ctaHome: string;
    };
    // Analysis / Cancel page
    analysis: {
        title: string;
        description: string;
        ctaPricing: string;
        ctaHome: string;
    };
    // Dashboard layout
    dashboardLayout: {
        overview: string;
        agentTerminal: string;
        astrologyProfile: string;
        upgradePlan: string;
        systemStatus: string;
        online: string;
        backToHome: string;
    };
    // Dashboard overview page
    dashboard: {
        welcome: string;
        subtitle: string;
        membership: string;
        creditsRemaining: string;
        upgrade: string;
        strategicPhase: string;
        consolidation: string;
        actionable: string;
        consultAgent: string;
        consultAgentDescription: string;
        initializeTerminal: string;
        systemWarningTitle: string;
        systemWarningDescription: string;
        calibrateProfile: string;
    };
    // Chat terminal
    chat: {
        title: string;
        sysOnline: string;
        agentReady: string;
        agentHint: string;
        thinking: string;
        placeholder: string;
        toolExecuted: string;
        toolRunning: string;
    };
    // Profile page
    profile: {
        title: string;
        description: string;
        dateOfBirth: string;
        timeOfBirth: string;
        cityOfBirth: string;
        cityPlaceholder: string;
        saveProfile: string;
    };
    // Daily Pulse
    dailyPulse: {
        title: string;
        calculated: string;
        fallback: string;
    };
}

export const appTranslations: Record<Locale, AppTranslations> = {
    en: {
        landing: {
            badge: 'SYSTEM V2 ONLINE',
            heroTitle1: 'Strategy Is',
            heroTitle2: 'Timing.',
            heroDescription: 'Rayoy maps your structural cycle using AI and classical Four Pillars analysis. Know exactly when to aggressively expand, gracefully pause, or strategically pivot.',
            ctaSignedIn: 'Enter Console',
            ctaSignedOut: 'Start Free Analysis',
            ctaTryFree: 'Try Free Preview',
            statsReadings: 'Cycle Readings',
            statsAccuracy: 'Timing Accuracy',
            statsCountries: 'Countries',
            howItWorksTitle: 'Three steps to strategic clarity.',
            howItWorksSubtitle: 'From raw birth data to actionable timing intelligence in under 60 seconds.',
            howItWorksSteps: [
                { step: '01', title: 'Input Your Data', description: 'Enter your birth date and time. Our engine calculates your complete Four Pillars (Bazi) chart — Year, Month, Day, and Hour pillars.' },
                { step: '02', title: 'AI Analyzes Your Cycle', description: 'The system cross-references your natal chart with current transits, identifying your active phase: expansion, consolidation, or volatility.' },
                { step: '03', title: 'Get Tactical Signals', description: 'Receive clear go/no-go windows for major decisions. Query the AI agent for real-time strategic guidance based on your exact chart.' },
            ],
            sectionTitle: 'Most failures are <em>timing</em> failures.',
            sectionDescription: 'We combine Western strategic logic with Eastern structural astrology (Bazi) to map your highest probability action windows.',
            features: [
                { title: 'Cycle Detection', description: 'Identify whether you are in an expansion, consolidation, or volatile phase based on precise historical and structural variables.' },
                { title: 'Tactical Windows', description: "Stop guessing. Get clear 'go/no-go' signals for major life and business decisions, down to the optimal month and day." },
                { title: 'AI Strategic Agent', description: 'Query the AI terminal instantly. Ask specific strategic questions and get answers grounded in your exact natal and transit charts.' },
            ],
            reportPreviewTitle: 'See what your report reveals.',
            reportPreviewSubtitle: 'A sample preview of the strategic intelligence you will receive.',
            reportLabels: { phase: 'Current Phase', trend: '3-Year Trend', risk: 'Risk Level', action: 'Recommendation' },
            reportValues: { phase: 'Consolidation', trend: 'Ascending — entering expansion window Q3', risk: 'Low', action: 'Prepare resources, defer major launches until transit alignment in August' },
            testimonialsTitle: 'What Strategists Say',
            testimonials: [
                { quote: 'Rayoy told me to delay my Series A by two months. Those two months changed everything — we closed at 3x the valuation.', name: 'K. Zhang', title: 'Founder, Stealth Startup' },
                { quote: "Finally, strategic timing advice that isn't hand-wavy astrology. The Bazi engine is genuinely impressive.", name: 'Sarah L.', title: 'VP Strategy, Fortune 500' },
                { quote: 'I was skeptical until it accurately flagged my consolidation phase. Now I check it before every major decision.', name: 'M. Toyota', title: 'Angel Investor' },
            ],
            faqTitle: 'Frequently Asked Questions',
            faqItems: [
                { q: 'Is this fortune telling?', a: 'No. Rayoy is a structured analytical framework based on cycle models. It does not predict the future — it identifies patterns in timing to support better decision-making.' },
                { q: 'How accurate is it?', a: 'Rayoy provides probabilistic analysis based on historical cycle patterns. It is a decision-support tool, not a guarantee of outcomes. Accuracy improves with precise birth data.' },
                { q: 'Who is it for?', a: 'Founders, executives, investors, and individuals making strategic decisions about timing — when to expand, when to pause, when to pivot.' },
                { q: 'Is this financial advice?', a: 'No. Rayoy is not a financial advisory service. It is a strategic analysis tool. All decisions remain your responsibility.' },
            ],
            tryCta: 'See Your Cycle — Free',
            tryCtaDescription: 'Enter your birth date and get an instant strategic timing preview. No sign-up required.',
            tryCtaButton: 'Try Free Preview',
            footerCopyright: '© 2026 Rayoy Intelligence Systems. All rights reserved.',
            footerLinks: { terms: 'Terms', privacy: 'Privacy', disclaimer: 'Disclaimer', refund: 'Refund', contact: 'Contact' },
        },
        pricing: {
            back: 'Back',
            title: 'Invest in Timing',
            description: 'Choose the intelligence tier that matches your ambition. Stop guessing when to pivot.',
            mostPopular: 'Most Popular',
            processing: 'Processing...',
            plans: [
                {
                    name: 'Free Report',
                    description: 'Basic analysis to get you started.',
                    features: ['1 Basic 3-Year Trend', 'General Risk Level', 'One-time Generation'],
                    buttonText: 'Get Started',
                },
                {
                    name: 'Plus',
                    description: 'Advanced strategic insights for individuals.',
                    features: ['Detailed Monthly Cycles', 'Bazi & Astrology Integration', '10 Agent Queries / mo', 'Email Support'],
                    buttonText: 'Upgrade to Plus',
                },
                {
                    name: 'Pro',
                    description: 'For founders making critical timing decisions.',
                    features: ['Everything in Plus', 'Unlimited Agent Queries', 'Partnership Alignment', 'Priority Support'],
                    buttonText: 'Upgrade to Pro',
                },
                {
                    name: 'Ultra',
                    description: 'The ultimate cycle intelligence system.',
                    features: ['Everything in Pro', 'Bespoke Annual Strategy', '1-on-1 Quarterly Review', 'White-glove Onboarding'],
                    buttonText: 'Get Ultra',
                },
            ],
        },
        success: {
            title: 'Payment Successful',
            description: 'Your payment has been securely processed. We are now initializing your cycle intelligence analysis environment.',
            ctaDashboard: 'Go to Dashboard',
            ctaHome: '← Back to Home',
        },
        analysis: {
            title: 'Checkout Cancelled',
            description: 'Your payment was not completed and you have not been charged.',
            ctaPricing: 'Return to Pricing',
            ctaHome: '← Back to Home',
        },
        dashboardLayout: {
            overview: 'Overview',
            agentTerminal: 'Agent Terminal',
            astrologyProfile: 'Astrology Profile',
            upgradePlan: 'Upgrade Plan',
            systemStatus: 'System Status:',
            online: 'Online',
            backToHome: 'Back to Home',
        },
        dashboard: {
            welcome: 'Welcome,',
            subtitle: 'Your real-time strategic alignment with the cosmic and industrial cycles.',
            membership: 'Membership',
            creditsRemaining: 'Credits Remaining',
            upgrade: 'UPGRADE',
            strategicPhase: 'Strategic Phase',
            consolidation: 'CONSOLIDATION',
            actionable: 'Actionable: Resource gathering for Q3',
            consultAgent: 'Consult Alpha Agent',
            consultAgentDescription: 'Deploy the Strategic Agent for real-time decision support based on your astronomical transits.',
            initializeTerminal: 'INITIALIZE TERMINAL',
            systemWarningTitle: 'System Accuracy Warning',
            systemWarningDescription: 'AI calculations are currently using baseline assumptions. Provide precise birth data to unlock granular Bazi and Astrological alignment metrics.',
            calibrateProfile: 'CALIBRATE PROFILE',
        },
        chat: {
            title: 'Strategic Agent Terminal',
            sysOnline: 'SYS_ONLINE',
            agentReady: 'Agent Alpha is ready.',
            agentHint: 'Ask about your current cycle, business timing, or request a Bazi reading.',
            thinking: 'THINKING...',
            placeholder: "Query the cycle (e.g., 'Should I launch my product next week?')",
            toolExecuted: '✓ EXECUTED:',
            toolRunning: 'RUNNING ALGORITHM:',
        },
        profile: {
            title: 'Astrological Profile',
            description: 'Provide exact data for the most accurate cycle calculations. Our Agent uses this to cast your natal and transit charts.',
            dateOfBirth: 'Date of Birth',
            timeOfBirth: 'Time of Birth (Exact)',
            cityOfBirth: 'City of Birth',
            cityPlaceholder: 'e.g., Shanghai, China',
            saveProfile: 'Save Profile',
        },
        dailyPulse: {
            title: 'Daily Strategic Pulse',
            calculated: 'Calculated',
            fallback: 'The alignment is shifting. Focus on structural integrity today.',
        },
    },
    'zh-CN': {
        landing: {
            badge: '系统 V2 已上线',
            heroTitle1: '策略在于',
            heroTitle2: '时机。',
            heroDescription: 'Rayoy 结合 AI 与经典四柱八字分析，精准绘制你的结构周期。掌握何时果断扩展、优雅暂停或战略转型。',
            ctaSignedIn: '进入控制台',
            ctaSignedOut: '免费开始分析',
            ctaTryFree: '免费体验',
            statsReadings: '周期分析',
            statsAccuracy: '时机准确率',
            statsCountries: '覆盖国家',
            howItWorksTitle: '三步获取战略清晰度。',
            howItWorksSubtitle: '从原始出生数据到可执行的时机洞察，60 秒内完成。',
            howItWorksSteps: [
                { step: '01', title: '输入数据', description: '输入出生日期和时间。引擎计算完整的四柱八字——年柱、月柱、日柱和时柱。' },
                { step: '02', title: 'AI 分析周期', description: '系统将你的命盘与当前流年交叉参照，识别当前活跃阶段：扩张、整合或波动。' },
                { step: '03', title: '获取战术信号', description: '获得重大决策的「行/不行」窗口。查询 AI 战略顾问，基于你的精确命盘获取实时指导。' },
            ],
            sectionTitle: '大多数失败都是<em>时机</em>上的失败。',
            sectionDescription: '我们融合西方战略逻辑与东方命理结构（八字），为你绘制最高概率的行动窗口。',
            features: [
                { title: '周期检测', description: '基于精准的历史与结构变量，识别您当前处于扩张、整合还是波动阶段。' },
                { title: '战术窗口', description: '停止猜测。获取清晰的「行/不行」信号，精确到最佳月份和日期，辅助重大人生和商业决策。' },
                { title: 'AI 战略顾问', description: '即时查询 AI 终端。提出具体的战略问题，获取基于您精确本命盘和流年盘的回答。' },
            ],
            reportPreviewTitle: '看看你的报告会揭示什么。',
            reportPreviewSubtitle: '战略智能报告的示例预览。',
            reportLabels: { phase: '当前阶段', trend: '三年趋势', risk: '风险等级', action: '建议' },
            reportValues: { phase: '整合期', trend: '上升趋势——Q3 进入扩张窗口', risk: '低', action: '储备资源，在 8 月流年到位前推迟重大发布' },
            testimonialsTitle: '战略家们怎么说',
            testimonials: [
                { quote: 'Rayoy 建议我将 A 轮融资推迟两个月。这两个月改变了一切——我们以 3 倍估值完成了融资。', name: '张 K.', title: '创始人，隐形创业公司' },
                { quote: '终于有了不再含糊的战略时机建议。八字引擎确实令人印象深刻。', name: 'Sarah L.', title: '战略VP，世界500强' },
                { quote: '起初我持怀疑态度，直到它准确识别了我的整合阶段。现在每个重大决策前我都会参考它。', name: 'M. Toyota', title: '天使投资人' },
            ],
            faqTitle: '常见问题',
            faqItems: [
                { q: '这是算命吗？', a: 'Rayoy 不是算命工具。它是一个基于周期模型的结构化分析框架，不预测未来，而是识别时机规律以辅助决策。' },
                { q: '准确度如何？', a: 'Rayoy 基于历史周期模式提供概率性分析，是决策辅助工具，不保证结果。输入精确的出生数据可以提高准确性。' },
                { q: '适合谁使用？', a: '创始人、高管、投资人，以及需要判断时机的个人——何时扩张、何时暂停、何时转向。' },
                { q: '这是投资建议吗？', a: 'Rayoy 不是财务咨询服务，而是战略分析工具。所有决策由你自己负责。' },
            ],
            tryCta: '免费查看你的周期',
            tryCtaDescription: '输入出生日期，即刻获取战略时机预览。无需注册。',
            tryCtaButton: '免费体验',
            footerCopyright: '© 2026 Rayoy 智能系统。保留所有权利。',
            footerLinks: { terms: '条款', privacy: '隐私', disclaimer: '免责声明', refund: '退款', contact: '联系' },
        },
        pricing: {
            back: '返回',
            title: '投资时机',
            description: '选择匹配你雄心的智能层级。不再猜测何时转型。',
            mostPopular: '最受欢迎',
            processing: '处理中...',
            plans: [
                {
                    name: '免费报告',
                    description: '基础分析，助你入门。',
                    features: ['1 份基础三年趋势', '通用风险等级', '一次性生成'],
                    buttonText: '开始使用',
                },
                {
                    name: 'Plus',
                    description: '面向个人的高级策略洞察。',
                    features: ['详细月度周期', '八字与星盘整合', '每月 10 次 AI 查询', '邮件支持'],
                    buttonText: '升级到 Plus',
                },
                {
                    name: 'Pro',
                    description: '为做关键时机决策的创始人打造。',
                    features: ['包含 Plus 全部功能', '无限 AI 查询', '合伙关系匹配', '优先支持'],
                    buttonText: '升级到 Pro',
                },
                {
                    name: 'Ultra',
                    description: '终极周期智能系统。',
                    features: ['包含 Pro 全部功能', '定制年度策略', '一对一季度复盘', '白手套服务'],
                    buttonText: '获取 Ultra',
                },
            ],
        },
        success: {
            title: '支付成功',
            description: '您的支付已安全处理完毕。我们正在初始化您的周期智能分析环境。',
            ctaDashboard: '进入控制台',
            ctaHome: '← 返回首页',
        },
        analysis: {
            title: '结账已取消',
            description: '您的支付未完成，未产生任何扣费。',
            ctaPricing: '返回定价页',
            ctaHome: '← 返回首页',
        },
        dashboardLayout: {
            overview: '总览',
            agentTerminal: 'AI 终端',
            astrologyProfile: '命理档案',
            upgradePlan: '升级方案',
            systemStatus: '系统状态：',
            online: '在线',
            backToHome: '返回首页',
        },
        dashboard: {
            welcome: '欢迎，',
            subtitle: '实时掌握你与宇宙及产业周期的战略对齐状态。',
            membership: '会员等级',
            creditsRemaining: '剩余额度',
            upgrade: '升级',
            strategicPhase: '战略阶段',
            consolidation: '整合期',
            actionable: '可执行：为 Q3 进行资源储备',
            consultAgent: '咨询 Alpha 智能体',
            consultAgentDescription: '部署战略智能体，基于你的天文流年数据提供实时决策支持。',
            initializeTerminal: '启动终端',
            systemWarningTitle: '系统精度警告',
            systemWarningDescription: 'AI 计算目前使用基准假设。提供精确出生数据以解锁细粒度八字及星盘对齐指标。',
            calibrateProfile: '校准档案',
        },
        chat: {
            title: '战略 AI 终端',
            sysOnline: '系统在线',
            agentReady: 'Alpha 智能体已就绪。',
            agentHint: '询问你当前的周期、商业时机，或请求八字解读。',
            thinking: '思考中...',
            placeholder: '查询周期（例如："我下周适合发布产品吗？"）',
            toolExecuted: '✓ 已执行：',
            toolRunning: '运行算法：',
        },
        profile: {
            title: '命理档案',
            description: '提供精确的数据以获取最准确的周期计算。我们的智能体会使用这些数据来排您的本命盘和流年盘。',
            dateOfBirth: '出生日期',
            timeOfBirth: '出生时辰（精确）',
            cityOfBirth: '出生城市',
            cityPlaceholder: '例如：上海',
            saveProfile: '保存档案',
        },
        dailyPulse: {
            title: '每日战略脉冲',
            calculated: '计算时间',
            fallback: '能量正在转移。今天请聚焦于结构稳固性。',
        },
    },
    'zh-TW': {
        landing: {
            badge: '系統 V2 已上線',
            heroTitle1: '策略在於',
            heroTitle2: '時機。',
            heroDescription: 'Rayoy 結合 AI 與經典四柱八字分析，精準繪製你的結構週期。掌握何時果斷擴展、優雅暫停或戰略轉型。',
            ctaSignedIn: '進入控制台',
            ctaSignedOut: '免費開始分析',
            ctaTryFree: '免費體驗',
            statsReadings: '週期分析',
            statsAccuracy: '時機準確率',
            statsCountries: '覆蓋國家',
            howItWorksTitle: '三步獲取戰略清晰度。',
            howItWorksSubtitle: '從原始出生數據到可執行的時機洞察，60 秒內完成。',
            howItWorksSteps: [
                { step: '01', title: '輸入數據', description: '輸入出生日期和時間。引擎計算完整的四柱八字——年柱、月柱、日柱和時柱。' },
                { step: '02', title: 'AI 分析週期', description: '系統將你的命盤與當前流年交叉參照，識別當前活躍階段：擴張、整合或波動。' },
                { step: '03', title: '獲取戰術信號', description: '獲得重大決策的「行/不行」窗口。查詢 AI 戰略顧問，基於你的精確命盤獲取即時指導。' },
            ],
            sectionTitle: '大多數失敗都是<em>時機</em>上的失敗。',
            sectionDescription: '我們融合西方戰略邏輯與東方命理結構（八字），為你繪製最高概率的行動窗口。',
            features: [
                { title: '週期檢測', description: '基於精準的歷史與結構變量，識別您當前處於擴張、整合還是波動階段。' },
                { title: '戰術窗口', description: '停止猜測。獲取清晰的「行/不行」信號，精確到最佳月份和日期，輔助重大人生和商業決策。' },
                { title: 'AI 戰略顧問', description: '即時查詢 AI 終端。提出具體的戰略問題，獲取基於您精確本命盤和流年盤的回答。' },
            ],
            reportPreviewTitle: '看看你的報告會揭示什麼。',
            reportPreviewSubtitle: '戰略智能報告的示例預覽。',
            reportLabels: { phase: '當前階段', trend: '三年趨勢', risk: '風險等級', action: '建議' },
            reportValues: { phase: '整合期', trend: '上升趨勢——Q3 進入擴張窗口', risk: '低', action: '儲備資源，在 8 月流年到位前推遲重大發佈' },
            testimonialsTitle: '戰略家們怎麼說',
            testimonials: [
                { quote: 'Rayoy 建議我將 A 輪融資推遲兩個月。這兩個月改變了一切——我們以 3 倍估值完成了融資。', name: '張 K.', title: '創始人，隱形創業公司' },
                { quote: '終於有了不再含糊的戰略時機建議。八字引擎確實令人印象深刻。', name: 'Sarah L.', title: '戰略VP，世界500強' },
                { quote: '起初我持懷疑態度，直到它準確識別了我的整合階段。現在每個重大決策前我都會參考它。', name: 'M. Toyota', title: '天使投資人' },
            ],
            faqTitle: '常見問題',
            faqItems: [
                { q: '這是算命嗎？', a: 'Rayoy 不是算命工具。它是一個基於週期模型的結構化分析框架，不預測未來，而是識別時機規律以輔助決策。' },
                { q: '準確度如何？', a: 'Rayoy 基於歷史週期模式提供概率性分析，是決策輔助工具，不保證結果。輸入精確的出生數據可以提高準確性。' },
                { q: '適合誰使用？', a: '創始人、高階主管、投資人，以及需要判斷時機的個人——何時擴張、何時暫停、何時轉向。' },
                { q: '這是投資建議嗎？', a: 'Rayoy 不是財務諮詢服務，而是戰略分析工具。所有決策由你自己負責。' },
            ],
            tryCta: '免費查看你的週期',
            tryCtaDescription: '輸入出生日期，即刻獲取戰略時機預覽。無需註冊。',
            tryCtaButton: '免費體驗',
            footerCopyright: '© 2026 Rayoy 智能系統。保留所有權利。',
            footerLinks: { terms: '條款', privacy: '隱私', disclaimer: '免責聲明', refund: '退款', contact: '聯繫' },
        },
        pricing: {
            back: '返回',
            title: '投資時機',
            description: '選擇匹配你雄心的智能層級。不再猜測何時轉型。',
            mostPopular: '最受歡迎',
            processing: '處理中...',
            plans: [
                {
                    name: '免費報告',
                    description: '基礎分析，助你入門。',
                    features: ['1 份基礎三年趨勢', '通用風險等級', '一次性生成'],
                    buttonText: '開始使用',
                },
                {
                    name: 'Plus',
                    description: '面向個人的高級策略洞察。',
                    features: ['詳細月度週期', '八字與星盤整合', '每月 10 次 AI 查詢', '郵件支持'],
                    buttonText: '升級到 Plus',
                },
                {
                    name: 'Pro',
                    description: '為做關鍵時機決策的創始人打造。',
                    features: ['包含 Plus 全部功能', '無限 AI 查詢', '合夥關係匹配', '優先支持'],
                    buttonText: '升級到 Pro',
                },
                {
                    name: 'Ultra',
                    description: '終極週期智能系統。',
                    features: ['包含 Pro 全部功能', '定制年度策略', '一對一季度複盤', '白手套服務'],
                    buttonText: '獲取 Ultra',
                },
            ],
        },
        success: {
            title: '支付成功',
            description: '您的支付已安全處理完畢。我們正在初始化您的週期智能分析環境。',
            ctaDashboard: '進入控制台',
            ctaHome: '← 返回首頁',
        },
        analysis: {
            title: '結賬已取消',
            description: '您的支付未完成，未產生任何扣費。',
            ctaPricing: '返回定價頁',
            ctaHome: '← 返回首頁',
        },
        dashboardLayout: {
            overview: '總覽',
            agentTerminal: 'AI 終端',
            astrologyProfile: '命理檔案',
            upgradePlan: '升級方案',
            systemStatus: '系統狀態：',
            online: '在線',
            backToHome: '返回首頁',
        },
        dashboard: {
            welcome: '歡迎，',
            subtitle: '實時掌握你與宇宙及產業週期的戰略對齊狀態。',
            membership: '會員等級',
            creditsRemaining: '剩餘額度',
            upgrade: '升級',
            strategicPhase: '戰略階段',
            consolidation: '整合期',
            actionable: '可執行：為 Q3 進行資源儲備',
            consultAgent: '諮詢 Alpha 智能體',
            consultAgentDescription: '部署戰略智能體，基於你的天文流年數據提供實時決策支持。',
            initializeTerminal: '啟動終端',
            systemWarningTitle: '系統精度警告',
            systemWarningDescription: 'AI 計算目前使用基準假設。提供精確出生數據以解鎖細粒度八字及星盤對齊指標。',
            calibrateProfile: '校準檔案',
        },
        chat: {
            title: '戰略 AI 終端',
            sysOnline: '系統在線',
            agentReady: 'Alpha 智能體已就緒。',
            agentHint: '詢問你當前的週期、商業時機，或請求八字解讀。',
            thinking: '思考中...',
            placeholder: '查詢週期（例如：「我下週適合發布產品嗎？」）',
            toolExecuted: '✓ 已執行：',
            toolRunning: '運行算法：',
        },
        profile: {
            title: '命理檔案',
            description: '提供精確的數據以獲取最準確的週期計算。我們的智能體會使用這些數據來排您的本命盤和流年盤。',
            dateOfBirth: '出生日期',
            timeOfBirth: '出生時辰（精確）',
            cityOfBirth: '出生城市',
            cityPlaceholder: '例如：上海',
            saveProfile: '儲存檔案',
        },
        dailyPulse: {
            title: '每日戰略脈衝',
            calculated: '計算時間',
            fallback: '能量正在轉移。今天請聚焦於結構穩固性。',
        },
    },
};
