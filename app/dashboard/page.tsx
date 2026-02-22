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

    const plan = dbUser?.plan || 'Free';
    const credits = dbUser?.credits || 0;

    return (
        <DashboardClient
            firstName={user.firstName}
            plan={plan}
            credits={credits}
            hasBirthDate={!!dbUser?.birth_date}
        />
    );
}
