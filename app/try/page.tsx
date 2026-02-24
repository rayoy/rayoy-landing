'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/lib/LanguageContext';

interface TrialResult {
    preview: string | null;
    chart: {
        fourPillars: string;
        dayMaster: string;
        zodiac: string;
        dominantElement: { zh: string; en: string };
        weakestElement: { zh: string; en: string };
    };
}

export default function TryPage() {
    const [birthDate, setBirthDate] = useState('');
    const [birthTime, setBirthTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TrialResult | null>(null);
    const { locale, ta } = useLanguage();
    const isZh = locale.startsWith('zh');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!birthDate) return;

        setLoading(true);
        setResult(null);

        try {
            const res = await fetch('/api/trial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ birthDate, birthTime: birthTime || undefined, locale }),
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error('Trial failed', err);
        } finally {
            setLoading(false);
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
                                ? '输入出生日期，即刻获取你的四柱八字和战略周期分析预览。'
                                : 'Enter your birth date for an instant Four Pillars analysis and strategic cycle preview.'}
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

                                {/* AI Preview */}
                                {result.preview && (
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600/10 via-gray-900/50 to-transparent border border-indigo-500/20">
                                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">
                                            {isZh ? '周期分析预览' : 'Cycle Analysis Preview'}
                                        </h3>
                                        <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm">
                                            {result.preview}
                                        </div>
                                    </div>
                                )}

                                {/* CTA */}
                                <div className="p-8 rounded-3xl bg-gray-900/30 border border-dashed border-gray-700 text-center space-y-4">
                                    <p className="text-gray-400 text-sm">
                                        {isZh
                                            ? '这只是冰山一角。注册后解锁完整分析、月度战术窗口和 AI 战略顾问。'
                                            : 'This is just the surface. Sign up to unlock your full analysis, monthly tactical windows, and AI strategic advisor.'}
                                    </p>
                                    <Link
                                        href="/sign-up"
                                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all"
                                    >
                                        {isZh ? '免费注册，解锁完整报告' : 'Sign Up Free — Unlock Full Report'}
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
