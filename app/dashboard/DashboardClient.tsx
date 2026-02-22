'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp } from 'lucide-react';
import DailyPulse from '@/components/DailyPulse';
import { useLanguage } from '@/lib/LanguageContext';

interface DashboardClientProps {
    firstName: string | null;
    plan: string;
    credits: number;
    hasBirthDate: boolean;
}

export default function DashboardClient({ firstName, plan, credits, hasBirthDate }: DashboardClientProps) {
    const { ta } = useLanguage();
    const t = ta.dashboard;

    return (
        <div className="space-y-10 fade-in px-4 py-6 md:px-0 relative">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
            <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/5 blur-[120px] pointer-events-none rounded-full" />

            <div className="relative z-10">
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500">
                    {t.welcome} {firstName || 'Strategist'}
                </h1>
                <p className="mt-3 text-gray-400 text-lg max-w-2xl font-light">
                    {t.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {/* Plan Widget */}
                <div className="p-8 rounded-[2rem] bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                    <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                        <Sparkles className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">{t.membership}</h3>
                    </div>
                    <p className="text-4xl font-black text-white capitalize tracking-tight">{plan}</p>
                    <div className="mt-8 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-400">{credits} {t.creditsRemaining}</span>
                        <Link href="/pricing" className="text-xs font-bold text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-4 py-2 rounded-full border border-indigo-500/30 transition-all">
                            {t.upgrade}
                        </Link>
                    </div>
                </div>

                {/* Cycle Widget */}
                <div className="p-8 rounded-[2rem] bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    <div className="absolute -top-10 -right-10 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-widest">{t.strategicPhase}</h3>
                    </div>
                    <p className="text-4xl font-black text-white tracking-tight">{t.consolidation}</p>
                    <div className="mt-8 text-sm font-medium text-emerald-400/80 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span>{t.actionable}</span>
                    </div>
                </div>

                {/* Agent Trigger Card */}
                <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600/20 via-indigo-900/10 to-transparent backdrop-blur-xl border border-indigo-500/20 flex flex-col justify-between group hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-all duration-500">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{t.consultAgent}</h3>
                        <p className="text-sm text-indigo-200/60 leading-relaxed font-light">
                            {t.consultAgentDescription}
                        </p>
                    </div>
                    <Link href="/dashboard/chat" className="mt-8 w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold transition-all text-center shadow-xl shadow-indigo-500/30 tracking-wide uppercase text-sm">
                        {t.initializeTerminal}
                    </Link>
                </div>
            </div>

            {/* Profile Completion Callout */}
            {!hasBirthDate && (
                <div className="mt-12 p-8 rounded-[2rem] border border-dashed border-gray-700 bg-gray-900/20 backdrop-blur-sm transition-all hover:bg-gray-900/30 group">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                        <div>
                            <h3 className="text-xl font-bold text-gray-200">{t.systemWarningTitle}</h3>
                            <p className="mt-2 text-sm text-gray-500 max-w-xl font-light leading-relaxed">
                                {t.systemWarningDescription}
                            </p>
                        </div>
                        <Link href="/dashboard/profile" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white border border-gray-700 rounded-xl font-bold transition-all whitespace-nowrap">
                            {t.calibrateProfile}
                        </Link>
                    </div>
                </div>
            )}

            <DailyPulse />
        </div>
    );
}
