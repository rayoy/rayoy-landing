'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Sparkles,
    Loader2,
    Lock,
    Download,
    Shield,
    TrendingUp,
    User,
    Zap,
    Calendar,
    Compass,
    Target,
    ChevronDown,
    ChevronUp,
    Star,
    Clock,
    CheckCircle2,
    Brain,
    Palette,
    FileText,
    Search,
} from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';

// ─── Types ──────────────────────────────────────────────────────────────

interface ReportSection {
    title: string;
    professional: string;
    plain: string;
}

interface FreeReport {
    identity: ReportSection;
    currentCycle: ReportSection;
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        title: string;
        professional: string;
        plain: string;
    };
}

interface LockedReport {
    actions?: {
        title: string;
        items: Array<{
            label: string;
            professional: string;
            plain: string;
        }>;
    };
    timing?: {
        title: string;
        windows: Array<{
            period: string;
            focus: string;
            detail: string;
        }>;
    };
    elementStrategy?: ReportSection;
    decisionAnalysis?: ReportSection;
}

interface TrialResult {
    freeReport: FreeReport | null;
    lockedReport: LockedReport | null;
    chart: {
        fourPillars: string;
        dayMaster: string;
        zodiac: string;
        dominantElement: { zh: string; en: string };
        weakestElement: { zh: string; en: string };
    };
    chartData?: any;
    imageUrl?: string | null;
}

const REPORT_VARIANT_ID = '1347035';

// ─── Sub-Components ─────────────────────────────────────────────────────

function DualLayerCard({
    icon,
    title,
    professional,
    plain,
    accentColor = 'indigo',
    badge,
    delay = 0,
}: {
    icon: React.ReactNode;
    title: string;
    professional: string;
    plain: string;
    accentColor?: 'indigo' | 'amber' | 'emerald' | 'red' | 'violet';
    badge?: string;
    delay?: number;
}) {
    const [expanded, setExpanded] = useState(false);

    const colorMap = {
        indigo: {
            bg: 'bg-indigo-500/5',
            border: 'border-indigo-500/20',
            iconBg: 'bg-indigo-500/10',
            iconBorder: 'border-indigo-500/20',
            iconText: 'text-indigo-400',
            badgeBg: 'bg-indigo-500/10',
            badgeText: 'text-indigo-300',
            plainBg: 'bg-indigo-500/5',
            plainBorder: 'border-indigo-500/10',
        },
        amber: {
            bg: 'bg-amber-500/5',
            border: 'border-amber-500/20',
            iconBg: 'bg-amber-500/10',
            iconBorder: 'border-amber-500/20',
            iconText: 'text-amber-400',
            badgeBg: 'bg-amber-500/10',
            badgeText: 'text-amber-300',
            plainBg: 'bg-amber-500/5',
            plainBorder: 'border-amber-500/10',
        },
        emerald: {
            bg: 'bg-emerald-500/5',
            border: 'border-emerald-500/20',
            iconBg: 'bg-emerald-500/10',
            iconBorder: 'border-emerald-500/20',
            iconText: 'text-emerald-400',
            badgeBg: 'bg-emerald-500/10',
            badgeText: 'text-emerald-300',
            plainBg: 'bg-emerald-500/5',
            plainBorder: 'border-emerald-500/10',
        },
        red: {
            bg: 'bg-red-500/5',
            border: 'border-red-500/20',
            iconBg: 'bg-red-500/10',
            iconBorder: 'border-red-500/20',
            iconText: 'text-red-400',
            badgeBg: 'bg-red-500/10',
            badgeText: 'text-red-300',
            plainBg: 'bg-red-500/5',
            plainBorder: 'border-red-500/10',
        },
        violet: {
            bg: 'bg-violet-500/5',
            border: 'border-violet-500/20',
            iconBg: 'bg-violet-500/10',
            iconBorder: 'border-violet-500/20',
            iconText: 'text-violet-400',
            badgeBg: 'bg-violet-500/10',
            badgeText: 'text-violet-300',
            plainBg: 'bg-violet-500/5',
            plainBorder: 'border-violet-500/10',
        },
    };

    const c = colorMap[accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
            className={`rounded-2xl ${c.bg} border ${c.border} overflow-hidden`}
        >
            {/* Header */}
            <div className="p-5 pb-0">
                <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 shrink-0 rounded-xl ${c.iconBg} border ${c.iconBorder} flex items-center justify-center`}>
                        {icon}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-bold text-sm leading-snug break-words">{title}</h3>
                            {badge && (
                                <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${c.badgeBg} ${c.badgeText} uppercase tracking-wider`}>
                                    {badge}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Professional Layer */}
            <div className="px-5 pb-4">
                <p className="text-gray-300 text-sm leading-relaxed break-words overflow-wrap-anywhere">
                    {professional}
                </p>
            </div>

            {/* Plain Language Layer (Collapsible) */}
            {plain && (
                <div className={`border-t ${c.plainBorder}`}>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className={`w-full px-5 py-3 flex items-center justify-between text-xs font-medium ${c.iconText} hover:opacity-80 transition-opacity`}
                    >
                        <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            {expanded ? '收起通俗解读' : '💡 用大白话解释'}
                        </span>
                        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <AnimatePresence>
                        {expanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <div className={`px-5 pb-4 ${c.plainBg} mx-3 mb-3 rounded-xl py-3`}>
                                    <p className="text-gray-400 text-sm leading-relaxed break-words overflow-wrap-anywhere italic">
                                        {plain}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}

function RiskBadge({ level, isZh }: { level: string; isZh: boolean }) {
    const config = {
        low: {
            label: isZh ? '低风险' : 'Low Risk',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/30',
            dot: 'bg-emerald-400',
        },
        medium: {
            label: isZh ? '中等风险' : 'Medium Risk',
            bg: 'bg-amber-500/10',
            text: 'text-amber-400',
            border: 'border-amber-500/30',
            dot: 'bg-amber-400',
        },
        high: {
            label: isZh ? '高风险' : 'High Risk',
            bg: 'bg-red-500/10',
            text: 'text-red-400',
            border: 'border-red-500/30',
            dot: 'bg-red-400',
        },
    };

    const c = config[level as keyof typeof config] || config.medium;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
            {c.label}
        </span>
    );
}

// ─── Analysis Progress ──────────────────────────────────────────────────

const ANALYSIS_STEPS = [
    { icon: Search, zh: '解析生辰数据...', en: 'Parsing birth data...' },
    { icon: Compass, zh: '构建四柱 & 紫微命盘...', en: 'Constructing Four Pillars & Ziwei chart...' },
    { icon: Brain, zh: 'AI 深度推演分析中...', en: 'AI deep analysis in progress...' },
    { icon: Palette, zh: '生成报告插图...', en: 'Generating report illustration...' },
    { icon: FileText, zh: '整理报告，即将完成...', en: 'Finalizing report...' },
];

// Step timing: cumulative delays (ms) for each step
const STEP_DELAYS = [0, 2000, 5000, 15000, 30000];

function AnalysisProgress({ stage, isZh }: { stage: number; isZh: boolean }) {
    // Animate progress bar based on stage
    const progress = Math.min(((stage + 1) / ANALYSIS_STEPS.length) * 100, 95);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-950/80 via-gray-900/90 to-purple-950/80 border border-indigo-500/20 backdrop-blur-sm"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">
                        {isZh ? '正在生成你的专属推演报告' : 'Generating your personalized report'}
                    </p>
                    <p className="text-xs text-gray-400">
                        {isZh ? '通常需要 30-45 秒' : 'Usually takes 30-45 seconds'}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-800 rounded-full mb-5 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
            </div>

            {/* Steps */}
            <div className="space-y-3">
                {ANALYSIS_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const isActive = i === stage;
                    const isDone = i < stage;
                    const isPending = i > stage;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                                opacity: isPending ? 0.3 : 1,
                                x: 0,
                            }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-indigo-500/10 border border-indigo-500/30' :
                                isDone ? 'bg-green-500/5' : ''
                                }`}
                        >
                            {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            ) : isActive ? (
                                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin flex-shrink-0" />
                            ) : (
                                <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${isActive ? 'text-indigo-300 font-medium' :
                                isDone ? 'text-green-400/70' : 'text-gray-600'
                                }`}>
                                {isZh ? step.zh : step.en}
                            </span>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────

export default function TryPage() {
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthCity, setBirthCity] = useState('');
    const [currentConcern, setCurrentConcern] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState(0);
    const stageTimersRef = useRef<NodeJS.Timeout[]>([]);
    const [unlocking, setUnlocking] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [result, setResult] = useState<TrialResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { locale } = useLanguage();
    const isZh = locale.startsWith('zh');
    const { isSignedIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate) return;

        setLoading(true);
        setLoadingStage(0);
        setResult(null);
        setError(null);

        // Start staged progress timers
        stageTimersRef.current.forEach(t => clearTimeout(t));
        stageTimersRef.current = STEP_DELAYS.slice(1).map((delay, i) =>
            setTimeout(() => setLoadingStage(i + 1), delay)
        );

        try {
            const res = await fetch('/api/trial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    birthDate,
                    birthTime: birthTime || undefined,
                    birthCity: birthCity || undefined,
                    currentConcern: currentConcern || undefined,
                    locale,
                }),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Analysis failed');
            }
            const data = await res.json();
            setLoadingStage(ANALYSIS_STEPS.length); // all done
            setResult(data);
        } catch (err: any) {
            console.error('Trial failed', err);
            setError(err.message || 'Analysis failed');
        } finally {
            stageTimersRef.current.forEach(t => clearTimeout(t));
            stageTimersRef.current = [];
            setLoading(false);
        }
    };

    const handleUnlockReport = async () => {
        if (!isSignedIn) {
            window.location.href = '/sign-in';
            return;
        }
        setUnlocking(true);
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ variantId: REPORT_VARIANT_ID }),
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        } finally {
            setUnlocking(false);
        }
    };

    const handleDownloadPdf = async () => {
        if (!birthDate) return;
        setDownloadingPdf(true);
        try {
            const userName = isSignedIn ? undefined : 'Strategist';

            // Create a hidden form for native browser download
            // This avoids massive base64 conversion that crashes Chrome for large files
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/api/pdf';
            form.style.display = 'none';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'data';
            input.value = JSON.stringify({
                birthDate,
                birthTime: birthTime || undefined,
                chartData: result?.chartData,
                userName,
                locale,
                freeReport: result?.freeReport,
                lockedReport: undefined,
            });

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);

            // Hide the spinner after a safe delay, since form.submit() doesn't return a promise
            setTimeout(() => setDownloadingPdf(false), 3000);

        } catch (error: any) {
            console.error('PDF download failed:', error);
            alert(isZh ? `PDF 生成失败：${error.message}` : `Failed to generate PDF: ${error.message}`);
            setDownloadingPdf(false);
        }
    };

    const report = result?.freeReport;

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <Navbar />

            <section className="relative pt-32 pb-24 px-6">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-2xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-wide mb-6">
                            <Sparkles className="w-3 h-3" />
                            {isZh ? '免费体验' : 'FREE PREVIEW'}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                            {isZh ? '发现你的周期密码' : 'Discover Your Cycle Code'}
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {isZh
                                ? '输入出生信息，即刻获取你的战略周期分析预览。'
                                : 'Enter your birth info for an instant Four Pillars analysis and strategic cycle preview.'}
                        </p>
                    </motion.div>

                    {/* Input Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="p-8 rounded-3xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    {isZh ? '出生日期 *' : 'Date of Birth *'}
                                </label>
                                <input
                                    type="date"
                                    value={birthDate}
                                    onChange={e => setBirthDate(e.target.value)}
                                    required
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans [color-scheme:dark]"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">
                                    {isZh ? '出生时辰（可选）' : 'Time of Birth (Optional)'}
                                </label>
                                <input
                                    type="time"
                                    value={birthTime}
                                    onChange={e => setBirthTime(e.target.value)}
                                    lang={isZh ? 'zh-CN' : 'en-US'}
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                {isZh ? '出生城市（可选）' : 'Birth City (Optional)'}
                            </label>
                            <input
                                type="text"
                                value={birthCity}
                                onChange={e => setBirthCity(e.target.value)}
                                placeholder={isZh ? '例如：上海、北京、New York' : 'e.g. Shanghai, New York, London'}
                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">
                                {isZh ? '当前面临的决策或困惑（可选）' : 'Current Decision or Concern (Optional)'}
                            </label>
                            <textarea
                                value={currentConcern}
                                onChange={e => setCurrentConcern(e.target.value)}
                                placeholder={isZh
                                    ? '例如：正在考虑是否跳槽、今年是否适合创业、投资时机选择...'
                                    : 'e.g. Considering a career change, timing for launching a startup, investment decisions...'}
                                rows={3}
                                className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                            />
                            <p className="text-xs text-gray-600">
                                {isZh
                                    ? '填写后，AI 将根据您的个人信息生成更精准的分析报告'
                                    : 'Helps the AI tailor your analysis with more relevant, precise insights'}
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !birthDate}
                            className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {isZh ? '分析中...' : 'Analyzing...'}
                                </>
                            ) : (
                                <>
                                    {isZh ? '生成我的周期分析' : 'Generate My Cycle Analysis'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </motion.form>

                    {/* Staged Progress Indicator */}
                    <AnimatePresence>
                        {loading && (
                            <AnalysisProgress stage={loadingStage} isZh={isZh} />
                        )}
                    </AnimatePresence>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* ─── Results ─────────────────────────────────────────── */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="mt-8 space-y-6"
                            >
                                {/* AI Illustration */}
                                {result.imageUrl && (
                                    <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden border border-gray-800 bg-gray-900/50 relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={result.imageUrl}
                                            alt="Cycle Analysis Concept Art"
                                            className="w-full h-full object-cover object-center opacity-90 transition-opacity hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 pointer-events-none">
                                            <p className="text-white/80 text-sm font-medium">
                                                {isZh ? '您的专属能量解析图卷' : 'Your Unique Energy Resonance Illustration'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Chart Summary Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{isZh ? '四柱' : 'Four Pillars'}</p>
                                        <p className="text-base font-bold text-indigo-400 font-mono break-all">{result.chart.fourPillars}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{isZh ? '日主' : 'Day Master'}</p>
                                        <p className="text-base font-bold text-white break-words">{result.chart.dayMaster}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{isZh ? '生肖' : 'Zodiac'}</p>
                                        <p className="text-base font-bold text-white">{result.chart.zodiac}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{isZh ? '五行' : 'Elements'}</p>
                                        <p className="text-sm font-bold text-emerald-400">{isZh ? '强' : '↑'} {result.chart.dominantElement.zh}</p>
                                        <p className="text-sm font-bold text-red-400">{isZh ? '弱' : '↓'} {result.chart.weakestElement.zh}</p>
                                    </div>
                                </div>

                                {/* Download PDF */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleDownloadPdf}
                                        disabled={downloadingPdf}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all disabled:opacity-50"
                                    >
                                        {downloadingPdf ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        ) : (
                                            <Download className="w-4 h-4 text-indigo-400" />
                                        )}
                                        {isZh ? '导出本地 PDF 报告' : 'Export PDF Report'}
                                    </button>
                                </div>

                                {/* ═══ FREE Report Cards ═══ */}
                                {report && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent" />
                                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                                                {isZh ? '免费分析报告' : 'Free Analysis Report'}
                                            </span>
                                            <div className="h-px flex-1 bg-gradient-to-l from-indigo-500/30 to-transparent" />
                                        </div>

                                        {/* 1. Identity */}
                                        <DualLayerCard
                                            icon={<User className="w-5 h-5 text-indigo-400" />}
                                            title={report.identity.title}
                                            professional={report.identity.professional}
                                            plain={report.identity.plain}
                                            accentColor="indigo"
                                            badge={isZh ? '核心人格' : 'Core Identity'}
                                            delay={0.1}
                                        />

                                        {/* 2. Current Cycle */}
                                        <DualLayerCard
                                            icon={<TrendingUp className="w-5 h-5 text-violet-400" />}
                                            title={report.currentCycle.title}
                                            professional={report.currentCycle.professional}
                                            plain={report.currentCycle.plain}
                                            accentColor="violet"
                                            badge={isZh ? '当前周期' : 'Current Cycle'}
                                            delay={0.2}
                                        />

                                        {/* 3. Risk Assessment */}
                                        <DualLayerCard
                                            icon={<Shield className="w-5 h-5 text-amber-400" />}
                                            title={report.riskAssessment.title}
                                            professional={report.riskAssessment.professional}
                                            plain={report.riskAssessment.plain}
                                            accentColor="amber"
                                            badge={<RiskBadge level={report.riskAssessment.level} isZh={isZh} /> as any}
                                            delay={0.3}
                                        />
                                    </div>
                                )}

                                {/* ═══ Upgrade CTA ═══ */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative rounded-3xl overflow-hidden"
                                >
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent pointer-events-none" />

                                    <div className="relative p-8 border border-amber-500/20 rounded-3xl bg-gray-900/80 backdrop-blur-sm">
                                        <div className="text-center mb-6">
                                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-4">
                                                <Lock className="w-7 h-7 text-amber-400" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {isZh ? '解锁完整专业报告' : 'Unlock Full Professional Report'}
                                            </h3>
                                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                                {isZh
                                                    ? '以上仅为免费预览。完整报告包含以下深度分析，助你精准把握关键决策时机。'
                                                    : 'The above is a free preview only. The full report includes deep analysis to help you make better-timed decisions.'}
                                            </p>
                                        </div>

                                        {/* What's included */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                            {[
                                                {
                                                    icon: <Target className="w-4 h-4 text-amber-400" />,
                                                    label: isZh ? '具体行动建议 (3-4条)' : 'Tactical Action Plans (3-4)',
                                                },
                                                {
                                                    icon: <Calendar className="w-4 h-4 text-amber-400" />,
                                                    label: isZh ? '最佳时机窗口 (未来6个月)' : 'Optimal Timing Windows (6 months)',
                                                },
                                                {
                                                    icon: <Compass className="w-4 h-4 text-amber-400" />,
                                                    label: isZh ? '五行调节策略' : 'Element Balancing Strategy',
                                                },
                                                {
                                                    icon: <Star className="w-4 h-4 text-amber-400" />,
                                                    label: isZh ? '决策分析 (针对你的困惑)' : 'Decision Analysis (your concern)',
                                                },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
                                                >
                                                    {item.icon}
                                                    <span className="text-sm text-gray-300">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Buttons */}
                                        <div className="space-y-3">
                                            <button
                                                onClick={handleUnlockReport}
                                                disabled={unlocking}
                                                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 text-base"
                                            >
                                                {unlocking ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Zap className="w-5 h-5" />
                                                        {isZh ? '¥9.9 立即解锁完整报告' : '$1.99 Unlock Full Report Now'}
                                                    </>
                                                )}
                                            </button>
                                            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {isZh ? '一次性付费' : 'One-time payment'}
                                                </span>
                                                <span>•</span>
                                                <span>{isZh ? '永久查看' : 'Permanent access'}</span>
                                                <span>•</span>
                                                <span>{isZh ? '含 PDF 导出' : 'PDF export included'}</span>
                                            </div>
                                        </div>

                                        {/* Alternative: membership */}
                                        <div className="mt-6 pt-5 border-t border-gray-800 text-center">
                                            <p className="text-gray-500 text-xs mb-2">
                                                {isZh
                                                    ? '或者加入会员，解锁全部功能 →'
                                                    : 'Or join a membership for full access →'}
                                            </p>
                                            <Link
                                                href="/pricing"
                                                className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                {isZh ? '查看会员方案' : 'View Membership Plans'}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* ═══ Locked Preview (blurred) ═══ */}
                                {result.lockedReport && (
                                    <div className="relative rounded-3xl overflow-hidden">
                                        <div className="p-6 bg-gray-900/30 border border-gray-800 rounded-3xl space-y-4 blur-[5px] select-none pointer-events-none" aria-hidden="true">
                                            {result.lockedReport.actions && (
                                                <div className="space-y-2">
                                                    <h4 className="text-white font-bold text-sm">{result.lockedReport.actions.title}</h4>
                                                    {result.lockedReport.actions.items?.map((item, i) => (
                                                        <div key={i} className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                                                            <p className="text-gray-300 text-sm">{item.label}: {item.professional}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {result.lockedReport.timing && (
                                                <div className="space-y-2">
                                                    <h4 className="text-white font-bold text-sm">{result.lockedReport.timing.title}</h4>
                                                    {result.lockedReport.timing.windows?.map((w, i) => (
                                                        <div key={i} className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                                                            <p className="text-gray-300 text-sm">{w.period} — {w.focus}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {result.lockedReport.elementStrategy && (
                                                <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                                                    <p className="text-gray-300 text-sm">{result.lockedReport.elementStrategy.professional}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
