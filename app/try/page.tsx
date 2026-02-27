'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';

interface TrialResult {
    freePreview: string | null;
    lockedPreview: string | null;
    chart: {
        fourPillars: string;
        dayMaster: string;
        zodiac: string;
        dominantElement: { zh: string; en: string };
        weakestElement: { zh: string; en: string };
    };
    imageUrl?: string | null;
}

const REPORT_VARIANT_ID = '1347035';

export default function TryPage() {
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [birthCity, setBirthCity] = useState('');
    const [currentConcern, setCurrentConcern] = useState('');
    const [loading, setLoading] = useState(false);
    const [unlocking, setUnlocking] = useState(false);
    const [result, setResult] = useState<TrialResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { locale } = useLanguage();
    const isZh = locale.startsWith('zh');
    const { isSignedIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate) return;

        setLoading(true);
        setResult(null);
        setError(null);

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
            setResult(data);
        } catch (err: any) {
            console.error('Trial failed', err);
            setError(err.message || 'Analysis failed');
        } finally {
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
                                ? '输入出生信息，即刻获取你的四柱八字和战略周期分析预览。'
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
                        {/* Row 1: Date + Time */}
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
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                                    className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Row 2: Birth City */}
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

                        {/* Row 3: Current Concern */}
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

                    {/* Error */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Results */}
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
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{isZh ? '四柱' : 'Four Pillars'}</p>
                                        <p className="text-lg font-bold text-indigo-400 font-mono">{result.chart.fourPillars}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{isZh ? '日主' : 'Day Master'}</p>
                                        <p className="text-lg font-bold text-white">{result.chart.dayMaster}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{isZh ? '生肖' : 'Zodiac'}</p>
                                        <p className="text-lg font-bold text-white">{result.chart.zodiac}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{isZh ? '五行' : 'Elements'}</p>
                                        <p className="text-sm font-bold text-emerald-400">{isZh ? '强' : '↑'} {result.chart.dominantElement.zh}</p>
                                        <p className="text-sm font-bold text-red-400">{isZh ? '弱' : '↓'} {result.chart.weakestElement.zh}</p>
                                    </div>
                                </div>

                                {/* FREE Preview Section */}
                                {result.freePreview && (
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600/10 via-gray-900/50 to-transparent border border-indigo-500/20">
                                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">
                                            {isZh ? '周期分析预览' : 'Cycle Analysis Preview'}
                                        </h3>
                                        <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm">
                                            {result.freePreview}
                                        </div>
                                    </div>
                                )}

                                {/* LOCKED Premium Section */}
                                {result.lockedPreview && (
                                    <div className="relative rounded-3xl overflow-hidden">
                                        {/* Blurred content */}
                                        <div className="p-8 bg-gradient-to-br from-amber-600/5 via-gray-900/50 to-transparent border border-amber-500/20 rounded-3xl">
                                            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-4">
                                                {isZh ? '专业行动建议 & 最佳时机窗口' : 'Action Recommendations & Optimal Timing'}
                                            </h3>
                                            <div
                                                className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm blur-[6px] select-none pointer-events-none"
                                                aria-hidden="true"
                                            >
                                                {result.lockedPreview}
                                            </div>
                                        </div>

                                        {/* Overlay with CTA */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col items-center justify-center p-8">
                                            <div className="bg-gray-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-8 max-w-sm text-center shadow-2xl shadow-amber-500/10">
                                                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                                                    <Lock className="w-6 h-6 text-amber-400" />
                                                </div>
                                                <h4 className="text-lg font-bold text-white mb-2">
                                                    {isZh ? '解锁完整专业报告' : 'Unlock Full Report'}
                                                </h4>
                                                <p className="text-sm text-gray-400 mb-6">
                                                    {isZh
                                                        ? '包含：行动建议、最佳时机窗口、五行调整策略，助你把握关键决策时机。'
                                                        : 'Includes: action recommendations, optimal timing windows, and element balancing strategy.'}
                                                </p>
                                                <button
                                                    onClick={handleUnlockReport}
                                                    disabled={unlocking}
                                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                                                >
                                                    {unlocking ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <>
                                                            {isZh ? '¥9.9 立即解锁' : '$1.99 Unlock Now'}
                                                            <ArrowRight className="w-4 h-4" />
                                                        </>
                                                    )}
                                                </button>
                                                <p className="mt-3 text-xs text-gray-500">
                                                    {isZh ? '一次性付费，永久查看' : 'One-time payment, permanent access'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Membership CTA */}
                                <div className="p-8 rounded-3xl bg-gray-900/30 border border-dashed border-gray-700 text-center space-y-4">
                                    <p className="text-gray-400 text-sm">
                                        {isZh
                                            ? '想要持续获取月度战术窗口和 AI 战略顾问？注册会员，解锁完整功能。'
                                            : 'Want ongoing monthly tactical windows and AI strategic advisor? Join a membership plan.'}
                                    </p>
                                    <Link
                                        href="/pricing"
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
                                    >
                                        {isZh ? '查看会员方案' : 'View Membership Plans'}
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
