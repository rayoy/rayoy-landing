export type Locale = 'en' | 'zh-CN' | 'zh-TW';

export interface Translations {
    nav: {
        howItWorks: string;
        pricing: string;
        tryFree: string;
        faq: string;
    };
    hero: {
        headline: string;
        subheadline: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    problem: {
        title: string;
        items: [string, string, string];
    };
    solution: {
        title: string;
        features: {
            phase: string;
            trend: string;
            risk: string;
            action: string;
        };
        reportPreview: {
            title: string;
            currentPhase: string;
            phaseLabel: string;
            trendLabel: string;
            riskLabel: string;
            recommendationLabel: string;
            trendValue: string;
            riskValue: string;
            recommendationValue: string;
        };
    };
    pricing: {
        title: string;
        price: string;
        period: string;
        note: string;
        cta: string;
        features: string[];
    };
    paymentError: string;
    faq: {
        title: string;
        items: {
            q: string;
            a: string;
        }[];
    };
    footer: {
        copyright: string;
        tagline: string;
    };
}

export const translations: Record<Locale, Translations> = {
    en: {
        nav: {
            howItWorks: 'How It Works',
            pricing: 'Pricing',
            tryFree: 'Try Free',
            faq: 'FAQ',
        },
        hero: {
            headline: 'Strategy Is Timing.',
            subheadline:
                'Rayoy analyzes your personal and business cycle to help you decide when to expand, pause, or pivot.',
            ctaPrimary: 'Get Your 3-Year Cycle Report',
            ctaSecondary: 'Learn the Method',
        },
        problem: {
            title: 'Most failures are timing failures.',
            items: [
                'Expansion at the wrong phase',
                'Misaligned partnerships',
                'Ignoring structural cycles',
            ],
        },
        solution: {
            title: 'Cycle Intelligence Report',
            features: {
                phase: 'Phase Identification',
                trend: '3-Year Trend Analysis',
                risk: 'Strategic Risk Signals',
                action: 'Action Recommendations',
            },
            reportPreview: {
                title: 'Sample Report Preview',
                currentPhase: 'Consolidation',
                phaseLabel: 'Current Phase',
                trendLabel: '3-Year Trend',
                riskLabel: 'Risk Level',
                recommendationLabel: 'Recommendation',
                trendValue: 'Ascending — entering expansion window',
                riskValue: 'Low',
                recommendationValue: 'Prepare resources for Q3 expansion',
            },
        },
        pricing: {
            title: 'Early Access',
            price: '$49',
            period: 'one-time',
            note: 'Limited early access pricing.',
            cta: 'Start Analysis',
            features: [
                'Full 3-Year Cycle Report',
                'Phase Identification',
                'Strategic Risk Signals',
                'Action Recommendations',
            ],
        },
        paymentError: 'Payment initialization failed. Please try again later.',
        faq: {
            title: 'Frequently Asked Questions',
            items: [
                {
                    q: 'Is this fortune telling?',
                    a: 'No. Rayoy is a structured analytical framework based on cycle models. It does not predict the future — it identifies patterns in timing to support better decision-making.',
                },
                {
                    q: 'How accurate is it?',
                    a: 'Rayoy provides probabilistic analysis based on historical cycle patterns. It is a decision-support tool, not a guarantee of outcomes. Accuracy depends on the quality of input data and the context of application.',
                },
                {
                    q: 'Who is it for?',
                    a: 'Founders, executives, investors, and individuals making strategic decisions about timing — when to expand, when to pause, when to pivot.',
                },
                {
                    q: 'Is this financial advice?',
                    a: 'No. Rayoy is not a financial advisory service. It is a strategic analysis tool. All decisions remain your responsibility. Consult qualified professionals for financial, legal, or medical advice.',
                },
            ],
        },
        footer: {
            copyright: '© Rayoy 2026',
            tagline: 'Cycle Intelligence System',
        },
    },
    'zh-CN': {
        nav: {
            howItWorks: '工作原理',
            pricing: '定价',
            tryFree: '免费体验',
            faq: '常见问题',
        },
        hero: {
            headline: '决策，先看节奏。',
            subheadline:
                'Rayoy 通过周期模型分析你的阶段位置与三年趋势，帮助你判断扩张、收缩或转向的时机。',
            ctaPrimary: '获取三年周期分析',
            ctaSecondary: '了解方法论',
        },
        problem: {
            title: '多数失败，本质是节奏错位。',
            items: [
                '在错误的阶段扩张',
                '合作关系节奏不匹配',
                '忽视结构性周期',
            ],
        },
        solution: {
            title: '周期智能分析报告',
            features: {
                phase: '阶段识别',
                trend: '三年趋势分析',
                risk: '战略风险信号',
                action: '行动建议',
            },
            reportPreview: {
                title: '报告预览示例',
                currentPhase: '整合期',
                phaseLabel: '当前阶段',
                trendLabel: '三年趋势',
                riskLabel: '风险等级',
                recommendationLabel: '建议',
                trendValue: '上升趋势 — 即将进入扩张窗口',
                riskValue: '低',
                recommendationValue: '为第三季度扩张储备资源',
            },
        },
        pricing: {
            title: '早鸟价格',
            price: '199 RMB',
            period: '一次性',
            note: '限时早鸟价格。',
            cta: '开始分析',
            features: [
                '完整三年周期报告',
                '阶段识别',
                '战略风险信号',
                '行动建议',
            ],
        },
        paymentError: '支付初始化失败，请稍后再试。',
        faq: {
            title: '常见问题',
            items: [
                {
                    q: '这是算命吗？',
                    a: 'Rayoy 不是算命工具。它是一个基于周期模型的结构化分析框架，不预测未来，而是识别时机规律以辅助决策。',
                },
                {
                    q: '准确度如何？',
                    a: 'Rayoy 基于历史周期模式提供概率性分析，是决策辅助工具，不保证结果。准确性取决于输入数据质量和应用场景。',
                },
                {
                    q: '适合谁使用？',
                    a: '创始人、高管、投资人，以及需要判断时机的个人 — 何时扩张、何时暂停、何时转向。',
                },
                {
                    q: '这是投资建议吗？',
                    a: 'Rayoy 不是财务咨询服务，而是战略分析工具。所有决策由你自己负责。如需财务、法律或医疗建议，请咨询专业人士。',
                },
            ],
        },
        footer: {
            copyright: '© Rayoy 2026',
            tagline: '周期智能系统',
        },
    },
    'zh-TW': {
        nav: {
            howItWorks: '工作原理',
            pricing: '定價',
            tryFree: '免費體驗',
            faq: '常見問題',
        },
        hero: {
            headline: '決策，先看節奏。',
            subheadline:
                'Rayoy 透過週期模型分析你的階段位置與三年趨勢，幫助你判斷擴張、收縮或轉向的時機。',
            ctaPrimary: '取得三年週期分析',
            ctaSecondary: '了解方法論',
        },
        problem: {
            title: '多數失敗，本質是節奏錯位。',
            items: [
                '在錯誤的階段擴張',
                '合作關係節奏不匹配',
                '忽視結構性週期',
            ],
        },
        solution: {
            title: '週期智能分析報告',
            features: {
                phase: '階段識別',
                trend: '三年趨勢分析',
                risk: '戰略風險信號',
                action: '行動建議',
            },
            reportPreview: {
                title: '報告預覽示例',
                currentPhase: '整合期',
                phaseLabel: '當前階段',
                trendLabel: '三年趨勢',
                riskLabel: '風險等級',
                recommendationLabel: '建議',
                trendValue: '上升趨勢 — 即將進入擴張窗口',
                riskValue: '低',
                recommendationValue: '為第三季度擴張儲備資源',
            },
        },
        pricing: {
            title: '早鳥價格',
            price: '199 RMB',
            period: '一次性',
            note: '限時早鳥價格。',
            cta: '開始分析',
            features: [
                '完整三年週期報告',
                '階段識別',
                '戰略風險信號',
                '行動建議',
            ],
        },
        paymentError: '支付初始化失敗，請稍後再試。',
        faq: {
            title: '常見問題',
            items: [
                {
                    q: '這是算命嗎？',
                    a: 'Rayoy 不是算命工具。它是一個基於週期模型的結構化分析框架，不預測未來，而是識別時機規律以輔助決策。',
                },
                {
                    q: '準確度如何？',
                    a: 'Rayoy 基於歷史週期模式提供概率性分析，是決策輔助工具，不保證結果。準確性取決於輸入數據品質和應用場景。',
                },
                {
                    q: '適合誰使用？',
                    a: '創始人、高階主管、投資人，以及需要判斷時機的個人 — 何時擴張、何時暫停、何時轉向。',
                },
                {
                    q: '這是投資建議嗎？',
                    a: 'Rayoy 不是財務諮詢服務，而是戰略分析工具。所有決策由你自己負責。如需財務、法律或醫療建議，請諮詢專業人士。',
                },
            ],
        },
        footer: {
            copyright: '© Rayoy 2026',
            tagline: '週期智能系統',
        },
    },
};
