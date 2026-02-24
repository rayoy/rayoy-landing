import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminStatsPage() {
    const { data: users } = await supabaseAdmin
        .from('users')
        .select('plan, credits, created_at, birth_date')
        .order('created_at', { ascending: false });

    const allUsers = users || [];
    const total = allUsers.length;
    const withBirthData = allUsers.filter(u => u.birth_date).length;
    const totalCreditsUsed = allUsers.reduce((sum, u) => {
        const initial = u.plan === 'free' ? 3 : u.plan === 'plus' ? 10 : 9999;
        return sum + Math.max(0, initial - (u.credits || 0));
    }, 0);

    const planBreakdown = allUsers.reduce((acc, u) => {
        const plan = u.plan || 'free';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Signups per day (last 14 days)
    const last14 = new Map<string, number>();
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        last14.set(d.toISOString().split('T')[0], 0);
    }
    allUsers.forEach(u => {
        if (u.created_at) {
            const day = new Date(u.created_at).toISOString().split('T')[0];
            if (last14.has(day)) last14.set(day, (last14.get(day) || 0) + 1);
        }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Platform Stats</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Total Users" value={total} />
                <StatCard label="With Birth Data" value={`${withBirthData} (${total ? Math.round(withBirthData / total * 100) : 0}%)`} />
                <StatCard label="Credits Used" value={totalCreditsUsed} />
                <StatCard label="Paid Users" value={(planBreakdown.plus || 0) + (planBreakdown.pro || 0) + (planBreakdown.ultra || 0)} />
            </div>

            {/* Plan Distribution */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Plan Distribution</h2>
                <div className="space-y-3">
                    {Object.entries(planBreakdown).sort((a, b) => b[1] - a[1]).map(([plan, count]) => (
                        <div key={plan} className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-300 w-16 capitalize">{plan}</span>
                            <div className="flex-1 bg-gray-800 rounded-full h-6 relative overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all ${plan === 'ultra' ? 'bg-amber-500' :
                                            plan === 'pro' ? 'bg-purple-500' :
                                                plan === 'plus' ? 'bg-indigo-500' :
                                                    'bg-gray-600'
                                        }`}
                                    style={{ width: `${total ? (count / total) * 100 : 0}%` }}
                                />
                                <span className="absolute inset-0 flex items-center px-3 text-xs font-mono text-white">
                                    {count}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Signups Chart (last 14 days) */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Signups (Last 14 Days)</h2>
                <div className="flex items-end gap-1 h-32">
                    {Array.from(last14.entries()).map(([day, count]) => {
                        const maxCount = Math.max(...Array.from(last14.values()), 1);
                        const height = (count / maxCount) * 100;
                        return (
                            <div key={day} className="flex-1 flex flex-col items-center gap-1">
                                <span className="text-[10px] text-gray-500 font-mono">{count || ''}</span>
                                <div
                                    className="w-full bg-indigo-500/60 rounded-t transition-all hover:bg-indigo-400"
                                    style={{ height: `${Math.max(height, 2)}%` }}
                                    title={`${day}: ${count} signups`}
                                />
                                <span className="text-[9px] text-gray-600 font-mono">{day.slice(8)}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
        </div>
    );
}
