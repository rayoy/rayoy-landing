'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, Bell } from 'lucide-react';
import DailyPulse from '@/components/DailyPulse';
import { useLanguage } from '@/lib/LanguageContext';

interface DashboardClientProps {
    firstName: string | null;
    plan: string;
    credits: number;
    hasBirthDate: boolean;
    extendedProfile: any;
    notifications: any[];
}

export default function DashboardClient({ firstName, plan, credits, hasBirthDate, extendedProfile, notifications }: DashboardClientProps) {
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10 w-full max-w-6xl mx-auto">
                {/* 1. Profile & Membership (Bento Large Block) */}
                <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 flex flex-col justify-between min-h-[300px]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/20 transition-all duration-700" />
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-[1rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-400 tracking-wider">RAYOY MEMBERSHIP</h3>
                        </div>
                        <h2 className="text-5xl font-black text-white capitalize tracking-tighter mb-2">{plan}</h2>
                        <p className="text-indigo-300 font-medium tracking-wide">
                            {credits} {t.creditsRemaining}
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="/pricing" className="inline-flex items-center justify-center font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-6 py-3 rounded-full transition-all border border-white/5 shadow-xl">
                            {t.upgrade}
                        </Link>
                    </div>
                </div>

                {/* 2. Current Energy / Cycle Widget */}
                <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/20 to-gray-900/40 backdrop-blur-xl border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-500 min-h-[300px] flex flex-col justify-between">
                    <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                        <TrendingUp className="w-48 h-48 text-emerald-500 mix-blend-overlay" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-[1rem] bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className="text-sm font-bold text-gray-400 tracking-wider">CURRENT STATE</h3>
                        </div>
                        <h2 className="text-4xl font-black text-white tracking-tight mb-2">Cycle Aligning</h2>
                        <div className="flex items-center gap-2 mt-4 bg-emerald-500/10 w-max px-4 py-2 rounded-full border border-emerald-500/20">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            <span className="text-sm font-bold text-emerald-300">Actionable Window Open</span>
                        </div>
                    </div>
                </div>

                {/* 3. Real Astrology Mini-View (Bazi) */}
                <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500 min-h-[300px]">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-bold text-gray-400 tracking-wider">STRUCTURAL IDENTITY MAP</h3>
                        <span className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">BAZI</span>
                    </div>

                    {extendedProfile?.bazi_chart ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-center">
                                {['YEAR', 'MONTH', 'DAY', 'HOUR'].map((pillar, i) => {
                                    const p = [
                                        extendedProfile.bazi_chart.yearPillar,
                                        extendedProfile.bazi_chart.monthPillar,
                                        extendedProfile.bazi_chart.dayPillar,
                                        extendedProfile.bazi_chart.hourPillar
                                    ][i];

                                    return (
                                        <div key={pillar} className="flex-1 px-2 border-r border-gray-800 last:border-0">
                                            <div className="text-[10px] text-gray-500 font-bold mb-3">{pillar}</div>
                                            {p ? (
                                                <div className="flex flex-col gap-2">
                                                    <div className="text-xl font-black text-white">{p.stem}{p.branch}</div>
                                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">{p.stemEn} {p.branchEn}</div>
                                                </div>
                                            ) : (
                                                <div className="text-xl font-bold text-gray-700">--</div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="pt-6 border-t border-gray-800/50 flex justify-between items-center">
                                <div className="text-sm">
                                    <span className="text-gray-500">Core Element: </span>
                                    <span className="text-white font-bold">{extendedProfile.bazi_chart.dayMaster?.elementEn}</span>
                                </div>
                                <div className="text-sm">
                                    <span className="text-gray-500">Strongest: </span>
                                    <span className="text-amber-400 font-bold">↑ {extendedProfile.bazi_chart.dominantElement?.en}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-50 py-10">
                            <div className="w-12 h-12 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-3">
                                <span className="text-gray-500 text-xs">?</span>
                            </div>
                            <p className="text-sm text-gray-500">Initialize profile to view structural map</p>
                        </div>
                    )}
                </div>

                {/* 4. AI Terminal Link */}
                <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-black backdrop-blur-xl border border-indigo-500/30 flex flex-col justify-between group hover:shadow-[0_0_50px_rgba(99,102,241,0.15)] transition-all duration-500 min-h-[300px]">
                    <div>
                        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{t.consultAgent}</h3>
                        <p className="text-sm text-indigo-200/60 leading-relaxed font-light">
                            {t.consultAgentDescription}
                        </p>
                    </div>
                    <Link href="/dashboard/chat" className="mt-8 w-full py-4 bg-white text-black hover:bg-gray-200 rounded-[1.25rem] font-bold transition-all text-center tracking-wide uppercase text-sm">
                        {t.initializeTerminal}
                    </Link>
                </div>
                {/* 5. Agentic Notifications Center */}
                <div className="md:col-span-4 p-8 rounded-[2.5rem] bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden group hover:border-gray-700 transition-all duration-500 min-h-[300px]">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-[1rem] bg-gray-800 flex items-center justify-center border border-gray-700 shadow-inner">
                            <Bell className="w-5 h-5 text-gray-300" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-400 tracking-wider">AGENTIC NOTIFICATIONS</h3>
                        {notifications?.length > 0 && (
                            <span className="ml-2 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{notifications.length} NEW</span>
                        )}
                    </div>

                    {notifications && notifications.length > 0 ? (
                        <div className="space-y-4">
                            {notifications.map((notif) => (
                                <div key={notif.id} className="p-4 rounded-2xl bg-gray-800/30 border border-gray-800 hover:bg-gray-800/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-bold">{notif.title}</h4>
                                        <span className="text-[10px] text-gray-500 capitalize">{notif.insight_type}</span>
                                    </div>
                                    <p className="text-sm text-gray-300 leading-relaxed">{notif.message}</p>
                                    <div className="mt-3 text-xs text-gray-500">
                                        {notif.created_at?.slice(0, 10)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full min-h-[150px] flex flex-col items-center justify-center opacity-50">
                            <Bell className="w-8 h-8 text-gray-600 mb-3" />
                            <p className="text-sm text-gray-500">No new structural alerts today</p>
                        </div>
                    )}
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
