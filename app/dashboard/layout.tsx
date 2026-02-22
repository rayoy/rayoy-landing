import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-gray-900/50 border-r border-gray-800 p-6 flex flex-col">
                <div className="flex items-center space-x-3 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500"></div>
                    <span className="text-xl font-bold tracking-wider">RAYOY</span>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" className="block px-4 py-2 rounded-lg bg-white/5 text-gray-200 hover:bg-white/10 transition-colors">
                        Overview
                    </Link>
                    <Link href="/dashboard/chat" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
                        Agent Terminal
                    </Link>
                    <Link href="/dashboard/profile" className="block px-4 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors">
                        Astrology Profile
                    </Link>
                    <Link href="/pricing" className="block md:hidden px-4 py-2 rounded-lg text-indigo-400 font-semibold hover:bg-indigo-500/10 transition-colors">
                        Upgrade Plan
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-800 flex items-center justify-between">
                    <UserButton showName />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header */}
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8">
                    <div className="text-sm font-medium text-gray-400">
                        System Status: <span className="text-emerald-400">Online</span>
                    </div>
                    <Link href="/pricing" className="hidden md:block text-sm font-semibold text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-full hover:bg-indigo-500/10 transition-colors">
                        Upgrade Plan
                    </Link>
                </header>

                <div className="p-8 max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
