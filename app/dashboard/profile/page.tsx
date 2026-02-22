import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    // Fetch current profile data
    const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('birth_date, birth_time, birth_location')
        .eq('id', user.id)
        .single();

    return (
        <div className="max-w-2xl fade-in">
            <h1 className="text-2xl font-bold text-white mb-2">Astrological Profile</h1>
            <p className="text-gray-400 mb-8">
                Provide exact data for the most accurate cycle calculations. Our Agent uses this to cast your natal and transit charts.
            </p>

            <form className="space-y-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800" action="/api/profile/update" method="POST">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300" htmlFor="birth_date">Date of Birth</label>
                        <input
                            type="date"
                            name="birth_date"
                            id="birth_date"
                            defaultValue={dbUser?.birth_date || ''}
                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300" htmlFor="birth_time">Time of Birth (Exact)</label>
                        <input
                            type="time"
                            name="birth_time"
                            id="birth_time"
                            defaultValue={dbUser?.birth_time || ''}
                            className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300" htmlFor="birth_location">City of Birth</label>
                    <input
                        type="text"
                        name="birth_location"
                        id="birth_location"
                        defaultValue={dbUser?.birth_location || ''}
                        placeholder="e.g., Shanghai, China"
                        className="w-full bg-black border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        required
                    />
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/25"
                    >
                        Save Profile
                    </button>
                </div>
            </form>
        </div>
    );
}
