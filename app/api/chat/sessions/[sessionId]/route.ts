import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET: load messages for a specific session
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    const user = await currentUser();
    if (!user) return new NextResponse('Unauthorized', { status: 401 });

    const { sessionId } = await params;

    const { data, error } = await supabaseAdmin
        .from('conversation_memory')
        .select('messages')
        .eq('user_id', user.id)
        .eq('session_id', sessionId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: data.messages || [] });
}
