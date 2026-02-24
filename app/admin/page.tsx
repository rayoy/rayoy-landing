import { supabaseAdmin } from '@/lib/supabase';

export default async function AdminPage() {
    const { data: users, error } = await supabaseAdmin
        .from('users')
        .select('id, email, first_name, last_name, plan, credits, birth_date, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        return <div className="text-red-400">Failed to load users: {error.message}</div>;
    }

    const totalUsers = users?.length || 0;
    const planCounts = users?.reduce((acc, u) => {
        acc[u.plan || 'free'] = (acc[u.plan || 'free'] || 0) + 1;
        return acc;
    }, {} as Record<string, number>) || {};

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">User Management</h1>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-500 uppercase">Total Users</p>
                    <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
                {Object.entries(planCounts).map(([plan, count]) => (
                    <div key={plan} className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                        <p className="text-xs text-gray-500 uppercase">{plan} plan</p>
                        <p className="text-2xl font-bold text-white">{count}</p>
                    </div>
                ))}
            </div>

            {/* User Table */}
            <div className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 text-left text-xs text-gray-500 uppercase">
                                <th className="px-4 py-3">User</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Plan</th>
                                <th className="px-4 py-3">Credits</th>
                                <th className="px-4 py-3">Birth Date</th>
                                <th className="px-4 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.map((user) => (
                                <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                    <td className="px-4 py-3 font-medium text-white">
                                        {user.first_name} {user.last_name}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.plan === 'ultra' ? 'bg-amber-500/20 text-amber-300' :
                                                user.plan === 'pro' ? 'bg-purple-500/20 text-purple-300' :
                                                    user.plan === 'plus' ? 'bg-indigo-500/20 text-indigo-300' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {user.plan || 'free'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 font-mono">{user.credits}</td>
                                    <td className="px-4 py-3 text-gray-400">{user.birth_date || '—'}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">
                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
