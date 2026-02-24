import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// Hard-coded admin emails — add your email here
const ADMIN_EMAILS = ['ray@rayoy.com', 'admin@rayoy.com'];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email || !ADMIN_EMAILS.includes(email)) {
        redirect('/dashboard');
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="border-b border-gray-800 bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/admin" className="text-lg font-bold text-white">
                            Rayoy <span className="text-red-400 text-xs font-mono">ADMIN</span>
                        </Link>
                        <nav className="flex gap-4 text-sm">
                            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">Users</Link>
                            <Link href="/admin/stats" className="text-gray-400 hover:text-white transition-colors">Stats</Link>
                        </nav>
                    </div>
                    <Link href="/dashboard" className="text-xs text-gray-500 hover:text-gray-300">
                        ← Dashboard
                    </Link>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
