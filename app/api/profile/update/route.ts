import { supabaseAdmin } from '@/lib/supabase';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { calculateFusionChart } from '@/lib/fusion';

export async function POST(req: Request) {
    const user = await currentUser();
    if (!user) redirect('/sign-in');

    const formData = await req.formData();
    const birth_date = formData.get('birth_date');
    const birth_time = formData.get('birth_time');
    const birth_location = formData.get('birth_location');

    const { error } = await supabaseAdmin
        .from('users')
        .upsert({
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            birth_date,
            birth_time: birth_time || null,
            birth_location: birth_location || null,
        }, { onConflict: 'id' });

    if (error) {
        console.error('Error saving profile', error);
    } else if (birth_date) {
        // Calculate and cache the fusion chart immediately
        try {
            const chart = calculateFusionChart(birth_date as string, (birth_time as string) || undefined, 'M');

            const { error: extError } = await supabaseAdmin
                .from('user_profiles_extended')
                .upsert({
                    user_id: user.id,
                    bazi_chart: chart.bazi as any,
                    ziwei_chart: chart.ziwei as any,
                    fusion_context: chart.fusionContext,
                }, { onConflict: 'user_id' });

            if (extError) {
                console.error('Failed to cache extended profile:', extError);
            }
        } catch (e) {
            console.error('Failed to calculate fusion chart in profile update:', e);
        }
    }

    redirect('/dashboard');
}
