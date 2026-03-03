import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) {
        redirect('/sign-in');
    }

    // Fetch user data from Supabase
    const { data: dbUser, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error || !dbUser) {
        console.error('Failed to fetch user data', error);
    }

    // Fetch extended user profile if it exists
    const { data: extendedProfile } = await supabaseAdmin
        .from('user_profiles_extended')
        .select('*')
        .eq('user_id', user.id)
        .single();

    // Fetch recent agentic notifications
    const { data: notifications } = await supabaseAdmin
        .from('agentic_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

    const plan = dbUser?.plan || 'Free';
    const credits = dbUser?.credits || 0;

    return (
        <DashboardClient
            firstName={user.firstName}
            plan={plan}
            credits={credits}
            hasBirthDate={!!dbUser?.birth_date}
            extendedProfile={extendedProfile || null}
            notifications={notifications || []}
        />
    );
}
