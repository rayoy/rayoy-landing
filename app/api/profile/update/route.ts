import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export async function POST(req: Request) {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const formData = await req.formData();
    const birth_date = formData.get('birth_date');
    const birth_time = formData.get('birth_time');
    const birth_location = formData.get('birth_location');

    const { error } = await supabaseAdmin
        .from('users')
        .update({
            birth_date,
            birth_time,
            birth_location,
        })
        .eq('id', user.id);

    if (error) {
        console.error('Error saving profile', error);
    }

    redirect('/dashboard');
}
