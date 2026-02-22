import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

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
        <ProfileClient
            birthDate={dbUser?.birth_date || null}
            birthTime={dbUser?.birth_time || null}
            birthLocation={dbUser?.birth_location || null}
        />
    );
}
