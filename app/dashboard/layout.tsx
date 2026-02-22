'use client';

import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useLanguage } from '@/lib/LanguageContext';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { ta } = useLanguage();
    const t = ta.dashboardLayout;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-gray-900/50 border-r border-gray-800 p-6 flex flex-col">
                <div className="flex items-center space-x-3 mb-10">
                    <Logo />
                    <span className="text-xl font-bold tracking-wider">RAYOY</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" className="block px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10 transition-colors">
                        {t.overview}
                    </Link>
                    <Link href="/dashboard/chat" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
                        {t.agentTerminal}
                    </Link>
                    <Link href="/dashboard/profile" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
                        {t.astrologyProfile}
                    </Link>
                    <Link href="/pricing" className="block md:hidden px-4 py-2 rounded-lg text-indigo-400 font-semibold hover:bg-indigo-500/10 transition-colors">
                        {t.upgradePlan}
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-800 space-y-4">
                    <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-200 transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                        {t.backToHome}
                    </Link>
                    <UserButton showName />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8">
                    <div className="text-sm font-medium text-gray-400">
                        {t.systemStatus} <span className="text-emerald-400">{t.online}</span>
                    </div>
                    <Link href="/pricing" className="hidden md:block text-sm font-semibold text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-full hover:bg-indigo-500/10 transition-colors">
                        {t.upgradePlan}
                    </Link>
                </header>

                <div className="p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
