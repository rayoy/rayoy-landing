'use client';

import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useLanguage } from '@/lib/LanguageContext';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { ta } = useLanguage();
    const t = ta.dashboardLayout;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-950">
                <div className="flex items-center gap-2">
                    <Logo />
                    <span className="text-lg font-bold tracking-wider">RAYOY</span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-gray-400 hover:text-white"
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`${mobileOpen ? 'flex' : 'hidden'} md:flex w-full md:w-64 bg-gray-900/50 border-r border-gray-800 p-6 flex-col absolute md:relative z-50 md:z-auto top-[53px] md:top-0 bottom-0 left-0`}>
                {/* Desktop Logo (hidden on mobile since we have the mobile header) */}
                <div className="hidden md:flex items-center space-x-3 mb-10">
                    <Logo />
                    <span className="text-xl font-bold tracking-wider">RAYOY</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10 transition-colors">
                        {t.overview}
                    </Link>
                    <Link href="/dashboard/chat" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
                        {t.agentTerminal}
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
                        {t.astrologyProfile}
                    </Link>
                    <Link href="/pricing" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-indigo-400 font-semibold hover:bg-indigo-500/10 transition-colors">
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

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-4 md:px-8">
                    <div className="text-sm font-medium text-gray-400">
                        {t.systemStatus} <span className="text-emerald-400">{t.online}</span>
                    </div>
                    <Link href="/pricing" className="hidden md:block text-sm font-semibold text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-full hover:bg-indigo-500/10 transition-colors">
                        {t.upgradePlan}
                    </Link>
                </header>

                <div className="p-4 md:p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
